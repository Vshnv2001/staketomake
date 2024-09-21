import {
  DynamicContextProvider,
  DynamicWidget,
  getAuthToken,
  useDynamicContext
} from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import {
  createConfig,
  WagmiProvider,
  useAccount,
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { mainnet } from 'viem/chains';

const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
  },
});

// NOTE: For testing only. To show the dynamicJwtToken
const queryClient = new QueryClient();

export default function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: '2c4aad80-975a-42d6-b20b-656b7cd82675',
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <DynamicWidget />
            <AccountInfo />
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
      
    </DynamicContextProvider>
  );
}

function AccountInfo() {
  const { authToken, handleLogOut, user, setShowAuthFlow } = useDynamicContext();
  const dynamicJwtToken = getAuthToken();
  
  return (
    <div>
      <p>dynamicJwtToken: {dynamicJwtToken}</p>
    </div>
  );
};
