import logo from './logo.svg';
import './App.css';
import { App as MintNFT } from './MintNFT'; 
import { WalletOptions } from './wallet-options'
import { useAccount } from 'wagmi';
import NFTCollection from './NFTCollection';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <MintNFT></MintNFT>
        <h3>Your collection</h3>
        <NFTCollection></NFTCollection>
      </header>
    </div>
  );
}

export default App;
