import React from "react";
import { AppShell } from "@mantine/core";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { HeaderMenu } from "./header";
import { FooterSocial } from "./footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AppShell>
      <DynamicContextProvider
        settings={{
          environmentId: "2c4aad80-975a-42d6-b20b-656b7cd82675",
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <HeaderMenu />
        {children}
        <FooterSocial />
      </DynamicContextProvider>
    </AppShell>
  );
};

export default Layout;
