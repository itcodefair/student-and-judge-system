"use client";
// Import styles of packages that you've installed.

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-datatable/styles.layer.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { nextFont } from "@/styles/next-font";
import { PropsWithChildren } from "react";
import { theme } from "@/styles/theme";
import AdminShell from "@/components/shells/AdminShell";
import { SWRConfig } from "swr";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <ColorSchemeScript /> */}
        <title>CDU IT Code Fair</title>
        <ColorSchemeScript defaultColorScheme="light" />
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
    <MantineProvider theme={theme} defaultColorScheme="light">
      <SWRConfig
        value={{
          refreshInterval: 3000,
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <AdminShell>{children}</AdminShell>
      </SWRConfig>
    </MantineProvider>
  );
};
