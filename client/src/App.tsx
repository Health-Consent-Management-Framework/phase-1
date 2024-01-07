import './App.css'
import { useWalletContext } from './store/walletProvider'


function App() {
  const {wallet,hasProvider,networkId} = useWalletContext()
                                                                            
  return (
    <div className="App">
      <h2>Injected Provider { hasProvider ? 'DOES' : 'DOES NOT'} Exist</h2>
        <div>Wallet Accounts: { wallet.accounts[0] }</div>
        <div>ChainId: { wallet.chainId }</div>
        <div>NetworkId: { networkId }</div>
    </div>
  )
}

export default App
