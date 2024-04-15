import logo from './logo.svg';
import './App.css';
import { App as MintNFT } from './MintNFT';
import { WalletOptions } from './wallet-options'
import { useAccount } from 'wagmi';
import NFTCollection from './NFTCollection';
import { useState } from 'react';
import { App as MintNFT1155 } from './MintNFT1155'
import { Account } from './account'


function App() {
  const { isConnected, address } = useAccount();
  function ConnectWallet() {
    const { isConnected } = useAccount()
    if (isConnected) return <Account />
    return <WalletOptions />
  }


  const [version, setVersion] = useState("ERC721");
  console.log("version", version)
  console.log("isConnected", isConnected)
  return (
    <div className="App">
      <div className='wallet'>
        <ConnectWallet />
      </div>
      {isConnected &&
        <div>
          <label>
            Select the contract version:
            <select defaultValue="ERC721" onChange={e => setVersion(e.target.value)}>
              <option value="ERC721">ERC721</option>
              <option value="ERC1155">ERC1155</option>
            </select >
          </label>

          {version == "ERC721" && <MintNFT></MintNFT>}
          {version == "ERC1155" && <MintNFT1155></MintNFT1155>}
          <h3>Your collection</h3>
          <NFTCollection></NFTCollection>
        </div>
      }
    </div>
  );
}

export default App;
