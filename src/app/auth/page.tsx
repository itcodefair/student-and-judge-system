"use client";

import {
  Center,
  Stack,
  Text,
  Paper,
  SegmentedControl,
  Grid,
} from "@mantine/core";
import Lottie from "lottie-react";
import CodingAnimation from "@/../public/images/Coding_Animation.json";
import React, { useState } from "react";
import LoginForm from "./component/LoginForm";
import RegisterForm from "./component/RegisterForm";

export default function Auth() {
  const [authForm, setAuthForm] = useState("login");
  return (
    <Stack>
      <Grid grow>
        <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
          <Lottie animationData={CodingAnimation} />
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, md: 6 }}
          mt={{ md: "lg" }}
          order={{ base: 1, md: 1 }}
        >
          <Stack mt={{ md: "lg" }}>
            <Center>
              <Text fz={{ base: 23, sm: 30, md: 35 }} fw={700}>
                Welcome to IT Code Fair Portal
              </Text>
            </Center>
            <Center>
              <Text fz={{ base: 15, sm: 20, md: 25 }} fw={500}>
                Take part in challenges & competitions
              </Text>
            </Center>
            <Paper withBorder shadow="sm" radius="md" p={"xl"}>
              <SegmentedControl
                mb={"sm"}
                data={[
                  { label: "Login", value: "login" },
                  { label: "Register", value: "register" },
                ]}
                fullWidth
                onChange={setAuthForm}
              />
              {authForm === "login" ? <LoginForm /> : <RegisterForm />}
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
