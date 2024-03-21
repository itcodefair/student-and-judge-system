import {
  Stack,
  SegmentedControl,
  TextInput,
  PasswordInput,
  Group,
  Button,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { IconLogin } from "@tabler/icons-react";
import React from "react";

export default function LoginForm() {
  const form = useForm<any>({
    name: "auth-form",
    validateInputOnBlur: true,
    validate: {
      email: isEmail("Enter your verified email"),
      password: isNotEmpty("Enter your password"),
    },
  });

  const handleOnLogin = async (formValues) => {
    console.log(formValues);
  };

  return (
    <form
      onSubmit={form.onSubmit((formValues: any) => {
        handleOnLogin(formValues);
      })}
    >
      <Stack gap={"xs"}>
        <TextInput
          label="Email"
          placeholder="s123456@cdu.edu.au"
          withAsterisk
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="*********"
          withAsterisk
          {...form.getInputProps("password")}
        />
        <Group justify="right">
          <Button size="compact-xs" variant="subtle">
            Forget password
          </Button>
        </Group>
        <Button type="submit" leftSection={<IconLogin />}>
          Login
        </Button>
      </Stack>
    </form>
  );
}
