import {
  Stack,
  Group,
  TextInput,
  Select,
  Button,
  Text,
  Textarea,
  Box,
} from "@mantine/core";
import {
  IconExclamationCircle,
  IconRefresh,
  IconUpload,
  IconX,
  IconJson,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { createFormActions, isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Dropzone } from "@mantine/dropzone";

export interface RubricFormValues {
  name: string;
  criteria: string;
  status: string;
}

export default function RubricForm({
  initialValues,
  handleSubmit,
  icon,
  buttonText,
  disabled,
}) {
  const [loading, setLoading] = useState(false);
  const [error, { toggle: toggleError }] = useDisclosure(false);
  const form = useForm<RubricFormValues>({
    name: "rubric-form",
    validateInputOnChange: true,
    validate: {
      name: isNotEmpty("Name cannot be empty"),
      criteria: (value) => {
        if (!value) {
          return "Criteria cannot be empty";
        }
        try {
          const parsedJson = JSON.parse(value);
          // Check if the parsed object conforms to the criteria interface
          try {
            const isValidCriteria = parsedJson.every(
              (jsonData) =>
                typeof jsonData === "object" &&
                "criteriaName" in jsonData &&
                typeof jsonData.criteriaName === "string" &&
                "criteriaDescription" in jsonData &&
                typeof jsonData.criteriaDescription === "string" &&
                "criteriaScore" in jsonData &&
                typeof jsonData.criteriaScore === "number" &&
                "gradingSchema" in jsonData &&
                Array.isArray(jsonData.gradingSchema) &&
                jsonData.gradingSchema.every(
                  (item) =>
                    typeof item === "object" &&
                    "gradeName" in item &&
                    typeof item.gradeName === "string" &&
                    "gradeDescription" in item &&
                    typeof item.gradeDescription === "string"
                )
            );
            if (!isValidCriteria) {
              throw Error;
            }
          } catch (error) {
            return "Invalid criteria data structure";
          }

          return undefined;
        } catch (error) {
          return `Invalid JSON format: ${error}`;
        }
      },
      status: isNotEmpty("Status cannot be empty"),
    },
    enhanceGetInputProps: () => {
      if (disabled) {
        return { disabled: true };
      }
      return {};
    },
  });

  const handleOnSubmit = async (values) => {
    setLoading(true);
    // Parse the criteria property to JSON if it exists
    if (values.criteria) {
      try {
        values.criteria = JSON.parse(values.criteria);
        const res = handleSubmit(values);
        res.then((promise) => {
          if (!promise) {
            throw Error;
          }
        });
      } catch (error) {
        toggleError();
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    form.initialize(initialValues);
  }, [form, initialValues]);

  const handleOnDrop = (file: import("@mantine/dropzone").FileWithPath[]) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        form.setFieldValue("criteria", jsonString);
      } catch (error) {
        form.setFieldError("criteria", error?.toString());
      }
    };

    // Read the dropped file as text
    if (file.length > 0) {
      reader.readAsText(file[0]);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((formValues: RubricFormValues) => {
        handleOnSubmit(formValues);
      })}
    >
      <Stack>
        {error && (
          <Group c="red.6">
            <IconExclamationCircle />
            <Text size="sm">{`Failed to ${buttonText.toLowerCase()} rubric`}</Text>
          </Group>
        )}
        <TextInput
          label="Rubric Name"
          placeholder="Rubric Name"
          withAsterisk
          {...form.getInputProps("name")}
        />
        <Dropzone
          onDrop={(file) => handleOnDrop(file)}
          // onReject={(files) => console.log("rejected files", files)}
          accept={{ "application/json": [".json"] }}
        >
          <Group justify="center" style={{ pointerEvents: "none" }}>
            <Dropzone.Accept>
              <IconUpload style={{ width: 50, height: 50 }} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{
                  width: 50,
                  height: 50,
                  color: "red",
                }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconJson
                style={{
                  width: 50,
                  height: 50,
                  color: "var(--mantine-color-dimmed)",
                }}
                stroke={1.5}
              />
            </Dropzone.Idle>
            <Box>
              <Text size="md">
                Drag json file here or click to select files to load criteria
              </Text>
            </Box>
          </Group>
        </Dropzone>
        <Textarea
          label="Criteria"
          placeholder="Criteria"
          withAsterisk
          resize="vertical"
          rows={10}
          {...form.getInputProps("criteria")}
        />
        <Select
          label="Status"
          placeholder="Choose a status"
          withAsterisk
          data={["Active", "Inactive"]}
          {...form.getInputProps("status")}
        />
        <Group justify={"space-between"}>
          <Button
            leftSection={<IconRefresh />}
            variant="default"
            onClick={() => {
              form.reset();
            }}
            disabled={disabled}
          >
            Reset
          </Button>
          <Button
            type="submit"
            loading={loading}
            leftSection={icon}
            disabled={disabled}
          >
            {buttonText}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export const RubricFormActions =
  createFormActions<RubricFormValues>("rubric-form");
