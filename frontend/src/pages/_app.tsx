// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import type { AppProps } from 'next/app';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/dates/styles.css';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import dynamic from 'next/dynamic';

const theme = createTheme({
  /** Put your mantine theme override here */
  fontFamily: 'Montserrat, sans-serif',
  defaultRadius: 'md',
});

const DynamicContextProviderNoSSR = dynamic(() => 
  import('@dynamic-labs/sdk-react-core').then(mod => mod.DynamicContextProvider), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <DynamicContextProviderNoSSR
        settings={{
          environmentId: process.env.DYNAMIC_ENV || "",
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
          <Component {...pageProps} />
      </DynamicContextProviderNoSSR>
    </MantineProvider>
  );
}