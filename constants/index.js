import wrapperJson from './WrappedRebaseToken.json';
import { erc20ABI } from 'wagmi';
import { priceOracleAbi } from './priceOracleAbi';

// use eth by default in prod and localhost by default in dev
export const defaultChainId = 56
export const validChains = [
  {
    id: 56,
    name: 'BSC',
    network: 'bsc_mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://bsc-dataseed.binance.org',
      default2: 'https://bsc-dataseed1.defibit.io/',
      default3: 'https://bsc-dataseed1.ninicoin.io/',
    },
    blockExplorers: {
      etherscan: {
        name: 'BNB Chain Explorer',
        url: 'https://bscscan.com',
      },
      default: {
        name: 'BNB Chain Explorer',
        url: 'https://bscscan.com',
      },
    },
    testnet: false,
  },
]
// .concat(process.env.NODE_ENV === 'production' ? [] : [
//   {
//     id: 97,
//     name: 'BSC',
//     network: 'bsc_testnet',
//     nativeCurrency: {
//       name: 'BNB',
//       symbol: 'BNB',
//       decimals: 18,
//     },
//     rpcUrls: {
//       default: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
//     },
//     blockExplorers: {
//       etherscan: {
//         name: 'BNB Testnet Explorer',
//         url: 'https://testnet.bscscan.com/',
//       },
//       default: {
//         name: 'BNB Testnet Explorer',
//         url: 'https://testnet.bscscan.com/',
//       },
//     },
//     testnet: true,
//   },
//   {
//     id: 1337,
//     name: 'Ganache',
//     network: 'ganache',
//     nativeCurrency: {
//       decimals: 18,
//       name: 'Ethereum',
//       symbol: 'ETH',
//     },
//     rpcUrls: {
//       default: 'http://127.0.0.1:8545',
//     },
//     blockExplorers: {
//       default: { name: 'Etherscan', url: 'https://wagmi.sh' },
//     },
//     testnet: true
//   }
// ]);

export const AALTO = {
  1337: {
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: erc20ABI
  },
  56: {
    address: '0xcE18FbBAd490D4Ff9a9475235CFC519513Cfb19a',
    abi: erc20ABI
  }
}

export const WRAPPER = {
  1337: {
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    abi: wrapperJson.abi
  },
  56: {
    address: '0x12b70d84DAb272Dc5A24F49bDbF6A4C4605f15da',
    abi: wrapperJson.abi,
  }
}

export const PRICE_ORACLE = {
  56: {
    address: '0x952B02F1973a1157cfE1B43d62aC6E1e921C5D00',
    abi: priceOracleAbi
  }
}