"use client";

import {
  Center,
  Group,
  Stack,
  Text,
  Title,
  Box,
  SimpleGrid,
  TextInput,
  Button,
  PasswordInput,
  Flex,
  Card,
  Paper,
} from "@mantine/core";
import Lottie from "lottie-react";
import CodingAnimation from "@/../public/images/Coding_Animation.json";
import React from "react";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { IconLogin } from "@tabler/icons-react";
import { theme } from "@/styles/theme";

export default function Auth() {
  const form = useForm<any>({
    name: "auth-form",
    validate: {
      email: isEmail("Title cannot be empty"),
      password: isNotEmpty("Please select a competition type"),
    },
  });
  return (
    <Stack align="center" mt="xl">
      <Title order={1}>
        Welcome to <span color={theme.primaryColor}>IT Code Fair Portal</span>
      </Title>
      <Title order={3}>Take part in challenges & competitions</Title>
      <Group grow justify="space-between">
        <Lottie animationData={CodingAnimation} />
        <Paper withBorder shadow="sm" radius="md" p={"xl"} h={"100%"}>
          <form
            onSubmit={form.onSubmit((formValues: any) => {
              console.log(formValues);
            })}
          >
            <Stack>
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
              <Button type="submit" leftSection={<IconLogin />}>
                Login
              </Button>
            </Stack>
          </form>
        </Paper>
      </Group>
    </Stack>
  );
}
