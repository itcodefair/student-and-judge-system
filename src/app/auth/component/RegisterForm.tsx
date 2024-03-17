import creditScores from "@/store/creditScore";
import educationLevels from "@/store/educationLevels";
import schoolList from "@/store/schoolList";
import {
  Stack,
  TextInput,
  PasswordInput,
  Group,
  Button,
  Select,
  Divider,
  Text,
  Box,
  rem,
  Popover,
  Progress,
  Alert
} from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import { IconCheck, IconInfoCircle, IconUserPlus, IconX } from "@tabler/icons-react";
import React, { useState } from "react";

interface RegisterFormData {
  firstName: string,
  lastName: string,
  gender: string,
  email: string,
  password: string,
  confirmPassword: string,
  educationLevel: string,
  school: string,
  credit: string | null
}

export default function RegisterForm() {
  const form = useForm<RegisterFormData>({
    name: "register-form",
    validateInputOnBlur: true,
    validate: {
      firstName: isNotEmpty("First name cannot be empty"),
      lastName: isNotEmpty("Last name cannot be empty"),
      gender: isNotEmpty("Gender cannot be empty"),
      email: isEmail("Invalid email"),
      password: (value) => {
        if (value) {
          const passwordStrength = getStrength(value);
          if (passwordStrength < 100) {
            return "Password is too weak"
          }
        } else {
          return "Password cannot be empty"
        }
      },
      confirmPassword: (value, values) => {
        if (value !== values.password) {
          return "Password did not match";
        }
      },
      educationLevel: isNotEmpty("Education level cannot be empty"),
      school: isNotEmpty("School cannot be empty"),
      credit: (value, values) => {
        if (values.school == 'Charles Darwin University') {
          if (!value) {
            return "Credit cannot be empty"
          }
        } else {
          values.credit = null
        }
      }
    }
  });
  const [popoverOpened, setPopoverOpened] = useState(false);
  const passwordValue = form.values['password'] ? form.values['password'] : '';
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(passwordValue)} />
  ));
  const strength = getStrength(passwordValue);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';
  return (
    <form
      onSubmit={form.onSubmit((formValues: any) => {
        console.log(formValues);
      })}
    >
      <Stack gap={"xs"}>
        <Alert variant="light" color="red" title="Alert title" icon={<IconInfoCircle />}>
          bruv
        </Alert>
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
          description="A verification email will be sent to this address"
          placeholder="s123456@cdu.edu.au"
          withAsterisk
          {...form.getInputProps("email")}
        />
        <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: 'pop' }}>
          <Popover.Target>
            <div
              onFocusCapture={() => setPopoverOpened(true)}
              onBlurCapture={() => setPopoverOpened(false)}
            >
              <PasswordInput
                label="Password"
                placeholder="********"
                withAsterisk
                {...form.getInputProps("password")}
              />
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            <Progress color={color} value={strength} size={5} mb="xs" />
            {checks}
          </Popover.Dropdown>
        </Popover>
        <PasswordInput
          label="Confirm Password"
          placeholder="********"
          withAsterisk
          {...form.getInputProps("confirmPassword")}
        />
        <Divider mt="xs" />
        <Select
          label="Highest level of education"
          description="Includes ongoing education"
          placeholder="Pick education level"
          data={educationLevels}
          withAsterisk
          {...form.getInputProps("educationLevel")}
        />
        <Select
          label="Current School"
          placeholder="Pick school"
          data={schoolList}
          withAsterisk
          {...form.getInputProps("school")}
        />
        {
          form.values['school'] === 'Charles Darwin University' &&
          <Select
            label="Completed Credit To Date"
            placeholder="Pick credit"
            data={creditScores}
            withAsterisk
            {...form.getInputProps("credit")}
          />
        }
        <Button mt={"xs"} type="submit" leftSection={<IconUserPlus />}>
          Register
        </Button>
      </Stack>
    </form>
  );
}

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text
      c={meets ? 'teal' : 'red'}
      style={{ display: 'flex', alignItems: 'center' }}
      mt={7}
      size="sm"
    >
      {meets ? (
        <IconCheck style={{ width: rem(14), height: rem(14) }} />
      ) : (
        <IconX style={{ width: rem(14), height: rem(14) }} />
      )}{' '}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /^.{8,}$/, label: 'Includes at least 8 characters' },
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
  let multiplier = password.length >= 8 ? 0 : 1;
  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });
  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}