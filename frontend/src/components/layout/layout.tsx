import React from "react";
import { AppShell } from "@mantine/core";

import { HeaderMenu } from "./header";
import { FooterSocial } from "./footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AppShell>

        <HeaderMenu />
        {children}
        <FooterSocial />
    </AppShell>
  );
};

export default Layout;
