import {
  Box,
  Text,
  Burger,
  AppShell,
  Image,
  Button,
  Group,
  Container,
  Menu,
  NavLink,
} from "@mantine/core";
import Link from "next/link";
import NextImage from "next/image";
import React, { PropsWithChildren } from "react";
import DesktopLogo from "@/../public/images/logo_desktop.png";
import MobileLogo from "@/../public/images/logo_mobile.png";
import { useDisclosure } from "@mantine/hooks";
import { IconMail, IconUserPlus, IconLogin } from "@tabler/icons-react";
import useBreakPoint from "@/hooks/useBreakPoints";
import { usePathname, useRouter } from "next/navigation";

export default function Shell(props: PropsWithChildren) {
  const { children } = props;
  const [opened, { toggle }] = useDisclosure();
  const isMobile = useBreakPoint("sm");
  const pathName = usePathname();
  return (
    <AppShell header={{ height: isMobile ? 50 : 60 }}>
      <AppShell.Header>
        <Container size="lg">
          <Group justify="space-between">
            <Group>
              <Menu shadow="md" width={150}>
                <Menu.Target>
                  <Burger
                    opened={opened}
                    onClick={toggle}
                    size="sm"
                    hiddenFrom="sm"
                  />
                </Menu.Target>
                <Menu.Dropdown hiddenFrom="sm">
                  <Menu.Item
                    leftSection={<IconMail />}
                    component="a"
                    href="/contact"
                  >
                    Contact
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconUserPlus />}
                    component="a"
                    href="/contact"
                  >
                    Register
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Image
                component={NextImage}
                src={MobileLogo}
                alt="CDU Logo"
                mah={45}
                hiddenFrom="sm"
              />
              <Image
                component={NextImage}
                src={DesktopLogo}
                alt="CDU Logo"
                mah={60}
                visibleFrom="sm"
              />
            </Group>
            <Group visibleFrom="sm">
              {!pathName.includes("contact") && (
                <Button
                  variant="outline"
                  leftSection={<IconMail />}
                  component={Link}
                  href="/contact"
                >
                  Contact
                </Button>
              )}
              {!pathName.includes("register") && (
                <Button
                  variant="outline"
                  leftSection={<IconUserPlus />}
                  component={Link}
                  href="/register"
                >
                  Register
                </Button>
              )}
              {!pathName.includes("auth") && (
                <Button
                  variant="outline"
                  leftSection={<IconLogin />}
                  component={Link}
                  href="/auth"
                >
                  Sign in
                </Button>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="lg" py={"xl"}>
          {children}
        </Container>
      </AppShell.Main>
      <AppShell.Footer px={"lg"}>
        <Group justify="right">
          <Text size="sm">&copy; ITCF 2024</Text>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}
