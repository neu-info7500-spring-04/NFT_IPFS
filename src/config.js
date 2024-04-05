import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = '64789d6c89996081bc3a94d4c7217b55'


export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    // injected(),
    // walletConnect({ projectId }),
    // metaMask(),
    // safe(),
  ],
  
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})