import { AppShell, Box, Burger, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NextImage from "next/image";
import Nav from "../nav/Nav";
import DesktopLogo from "@/../public/images/logo_desktop.png";
import MobileLogo from "@/../public/images/logo_mobile.png";
import { PropsWithChildren } from "react";

export default function AdminShell(props: PropsWithChildren) {
  const { children } = props;
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      // padding="md"
    >
      <AppShell.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        px={"md"}
      >
        <Box
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          hiddenFrom="sm"
        >
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <Image
              component={NextImage}
              src={MobileLogo}
              alt="CDU Logo"
              mah={50}
            />
          </Box>
        </Box>
        <Box ml={"lg"} visibleFrom="sm">
          <Image
            component={NextImage}
            src={DesktopLogo}
            alt="CDU Logo"
            mah={60}
          />
        </Box>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Nav />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
