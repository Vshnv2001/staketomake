// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import type { AppProps } from 'next/app';
import { createTheme, MantineProvider } from '@mantine/core';
import { Web3Provider } from '../contexts/web3context';
import '@mantine/dates/styles.css';
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const theme = createTheme({
  /** Put your mantine theme override here */
  fontFamily: 'Montserrat, sans-serif',
  defaultRadius: 'md',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <DynamicContextProvider
        settings={{
          environmentId: "2c4aad80-975a-42d6-b20b-656b7cd82675",
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
      </DynamicContextProvider>
    </MantineProvider>
  );
}