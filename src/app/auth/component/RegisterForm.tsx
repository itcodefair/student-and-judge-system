import {
  Stack,
  TextInput,
  PasswordInput,
  Group,
  Button,
  Select,
  Divider,
} from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import { IconUserPlus } from "@tabler/icons-react";
import React from "react";

export default function RegisterForm() {
  const form = useForm<any>({
    name: "register-form",
    validate: {
      email: isEmail("Title cannot be empty"),
      password: isNotEmpty("Please select a competition type"),
    },
  });
  return (
    <form
      onSubmit={form.onSubmit((formValues: any) => {
        console.log(formValues);
      })}
    >
      <Stack gap={"xs"}>
        <Group justify="space-between" grow>
          <TextInput
            label="First Name"
            placeholder="First name"
            withAsterisk
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Last Name"
            placeholder="Last Name"
            withAsterisk
            {...form.getInputProps("lastName")}
          />
        </Group>
        <Select
          label="Gender"
          placeholder="Pick gender"
          data={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Prefer not to say", value: "not-specified" },
          ]}
          withAsterisk
          {...form.getInputProps("gender")}
        />
        <TextInput
          label="Email"
          placeholder="s123456@cdu.edu.au"
          withAsterisk
          {...form.getInputProps("email")}
        />
        <Group justify="space-between" grow>
          <PasswordInput
            label="Password"
            placeholder="*********"
            withAsterisk
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="*********"
            withAsterisk
            {...form.getInputProps("confirmPassword")}
          />
        </Group>
        <Divider mt="xs" />
        <Select
          label="Highest level of education"
          description="Includes ongoing education"
          placeholder="Pick education level"
          data={[
            {
              label: "Primary School",
              value: "primary",
            },
            {
              label: "Secondary School",
              value: "secondary",
            },
            {
              label: "Short Course/TAFE/Cert",
              value: "tafe",
            },
            {
              label: "Undergraduate",
              value: "undergraduate",
            },
            {
              label: "Postgraduate",
              value: "postgraduate",
            },
          ]}
          withAsterisk
          {...form.getInputProps("educationLevel")}
        />
        <Select
          label="School"
          placeholder="Pick school"
          data={[
            {
              label: "Charles Darwin University",
              value: "Charles Darwin University",
            },
            { label: "Other", value: "other" },
          ]}
          withAsterisk
          {...form.getInputProps("school")}
        />
        <Select
          label="Completed Credit To Date"
          placeholder="Pick credit"
          data={[
            {
              label: "0 - 80 credits",
              value: "1",
            },
            {
              label: "81 - 120 credits",
              value: "2",
            },
            {
              label: "120+ credits",
              value: "3",
            },
            {
              label: "Not Applicable (Short Course/TAFE)",
              value: "0",
            },
          ]}
          withAsterisk
          {...form.getInputProps("credit")}
        />
        <Button mt={"xs"} type="submit" leftSection={<IconUserPlus />}>
          Register
        </Button>
      </Stack>
    </form>
  );
}
