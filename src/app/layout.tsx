"use client";
// Import styles of packages that you've installed.

import "@mantine/core/styles.css";
import "mantine-datatable/styles.layer.css";
import { MantineProvider } from "@mantine/core";
import { nextFont } from "@/styles/next-font";
import { PropsWithChildren } from "react";
import { theme } from "@/styles/theme";
import AdminShell from "@/components/shells/AdminShell";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <ColorSchemeScript /> */}
        <title>CDU IT Code Fair</title>
      </head>
      <body className={`${nextFont.className}`}>
        <MantineLayout>{children}</MantineLayout>
      </body>
    </html>
  );
}

const MantineLayout = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <MantineProvider theme={theme}>
      <AdminShell>{children}</AdminShell>
    </MantineProvider>
  );
};
