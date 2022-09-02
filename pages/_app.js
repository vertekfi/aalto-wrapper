// React
import { useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Wagmi
import {
  WagmiConfig,
  createClient,
  configureChains,
} from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { validChains } from '../constants';

// Components
import Layout from '../components/utils/Layout';

// Styles
import '../styles/globals.scss';



const { provider, webSocketProvider } = configureChains(
  validChains,
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default }),
    }),
  ],
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      validChains,
      options: {
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      validChains,
      options: {
        qrcode: true,
        rpc: {
          [56]: `https://bsc-dataseed1.binance.org/`,
          [1]: `https://bsc-dataseed1.binance.org/`
        },
      },
    }),
    new InjectedConnector({
      validChains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider
});

// Render the app
function App({Component, pageProps}) {
  const [queryClient] = useState(() => new QueryClient())
  
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <WagmiConfig client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WagmiConfig>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default App;