import {
  Box,
  Button,
  Divider,
  NavLink,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import React, { PropsWithChildren, useState } from "react";
import {
  IconUserCircle,
  IconFiles,
  IconDashboard,
  IconUsers,
  IconUserCog,
  IconSettings,
  IconTrophy,
  IconBadges,
  IconLogout,
  IconTournament,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from "./AdminNav.module.css";

const navLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <IconDashboard size="1rem" stroke={1.5} />,
  },
  {
    href: "/admin/competitions",
    label: "Competitions",
    icon: <IconFiles size="1rem" stroke={1.5} />,
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: <IconTournament size="1rem" stroke={1.5} />,
  },
  {
    href: "/admin/winners",
    label: "Winners",
    icon: <IconTrophy size="1rem" stroke={1.5} />,
  },
  {
    href: "/admin/assign-judge",
    label: "Assign Judges",
    icon: <IconBadges size="1rem" stroke={1.5} />,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: <IconUsers size="1rem" stroke={1.5} />,
  },
  // {
  //   href: "/admin/settings",
  //   label: "Site Settings",
  //   icon: <IconSettings size="1rem" stroke={1.5} />,
  // },
];

export default function Nav(props: PropsWithChildren) {
  const { children } = props;
  const theme = useMantineTheme();
  const router = usePathname();
  return (
    <Stack justify="space-between" h={"100%"}>
      <Stack
        bg={theme.colors.cduBlue[2]}
        p={"sm"}
        style={{ borderRadius: "8px" }}
        gap={"sm"}
      >
        {navLinks.map((item, index) => (
          <NavLink
            classNames={classes}
            key={index}
            component={Link}
            href={item.href}
            label={item.label}
            leftSection={item.icon}
            variant="filled"
            active={router === item.href}
          />
        ))}
      </Stack>
      <Stack>
        <Divider></Divider>
        <NavLink
          key="profile"
          classNames={classes}
          component={Link}
          href="/profile"
          label="Profile"
          leftSection={<IconUserCircle size="1rem" stroke={1.5} />}
          variant="filled"
          active={router === "/profile"}
        />
        <NavLink
          key="logout"
          classNames={classes}
          component={Link}
          href="/logout"
          label="Logout"
          leftSection={<IconLogout size="1rem" stroke={1.5} />}
          variant="filled"
        />
      </Stack>
    </Stack>
  );
}
