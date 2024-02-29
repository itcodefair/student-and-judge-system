import { Text, Button, Group, Select, Stack, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconCalendar,
  IconExclamationCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { useForm, isNotEmpty, createFormActions } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";
import { useEffect, useState } from "react";
import useSWR from "swr";

export interface CompetitionFormValues {
  title: string;
  type: string;
  rubricId: string;
  judgeDate: Date | null;
  registrationStartDate: Date | null;
  registrationEndDate: Date | null;
  status: string;
}

export default function CompetitionForm({
  initialValues,
  handleSubmit,
  icon,
  buttonText,
  disabled,
}) {
  const [loading, setLoading] = useState(false);
  const [error, { toggle: toggleError }] = useDisclosure(false);
  const { data: rubrics } = useSWR("/api/db/rubric");
  const form = useForm<CompetitionFormValues>({
    name: "competition-form",
    validateInputOnChange: true,
    validate: {
      title: isNotEmpty("Title cannot be empty"),
      type: isNotEmpty("Please select a competition type"),
      registrationStartDate: (value, values) => {
        if (!value) {
          return "Start date cannot be empty";
        } else if (
          value &&
          values.registrationEndDate &&
          new Date(value) > new Date(values.registrationEndDate)
        ) {
          return "Start date cannot be more than end date";
        }
        return null;
      },
      registrationEndDate: (value, values) => {
        if (!value) {
          return "End date cannot be empty";
        } else if (
          value &&
          values.judgeDate &&
          new Date(value) >= new Date(values.judgeDate)
        ) {
          return "End date cannot be more than or equal to judge date";
        }
        return null;
      },
      judgeDate: isNotEmpty("Judge date cannot be empty"),
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
    const res = handleSubmit(values);
    res
      .then((promise) => {
        if (!promise) {
          toggleError();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    form.initialize(initialValues);
  }, [form, initialValues]);

  return (
    <form
      onSubmit={form.onSubmit((formValues: CompetitionFormValues) => {
        handleOnSubmit(formValues);
      })}
    >
      <Stack>
        {error && (
          <Group c="red.6">
            <IconExclamationCircle />
            <Text size="sm">{`Failed to ${buttonText.toLowerCase()} competition`}</Text>
          </Group>
        )}
        <TextInput
          label="Title"
          //   description="Input description"
          placeholder="Title"
          withAsterisk
          {...form.getInputProps("title")}
        />
        <Select
          label="Competition type"
          placeholder="Choose a type"
          withAsterisk
          data={[
            "Coding",
            "Business Inovation",
            "Poster",
            "Security Challenge",
          ]}
          {...form.getInputProps("type")}
        />
        <Select
          label="Grading rubric"
          placeholder="Choose a rubric"
          clearable
          data={rubrics.map((rubric) => ({
            value: rubric.id,
            label: rubric.name,
          }))}
          {...form.getInputProps("rubricId")}
        />
        <Group grow>
          <DatePickerInput
            rightSection={<IconCalendar />}
            rightSectionPointerEvents="none"
            placeholder="Pick a date..."
            valueFormat="DD-MM-YYYY"
            label="Registration start date"
            hideOutsideDates
            minDate={moment().toDate()}
            {...form.getInputProps("registrationStartDate")}
          />
          <DatePickerInput
            rightSection={<IconCalendar />}
            rightSectionPointerEvents="none"
            placeholder="Pick a date..."
            valueFormat="DD-MM-YYYY"
            label="Registration end date"
            hideOutsideDates
            disabled={
              form.getInputProps("registrationStartDate").value === null
            }
            minDate={moment(
              form.getInputProps("registrationStartDate").value
            ).toDate()}
            {...form.getInputProps("registrationEndDate")}
          />
        </Group>
        <DatePickerInput
          rightSection={<IconCalendar />}
          rightSectionPointerEvents="none"
          placeholder="Pick a date..."
          valueFormat="DD-MM-YYYY"
          label="Judge date"
          hideOutsideDates
          disabled={form.getInputProps("registrationEndDate").value === null}
          minDate={moment(form.getInputProps("registrationEndDate").value)
            .add(1, "days")
            .toDate()}
          {...form.getInputProps("judgeDate")}
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
              console.log(form.values);
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

export const CompetitionFormActions =
  createFormActions<CompetitionFormValues>("competition-form");
