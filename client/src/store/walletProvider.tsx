import Web3 from "web3";
import { createContext, useContext, useEffect, useState } from "react";

type walletType = {
    accounts:string[],
    balance?: string
    chainId?: string
}

interface walletContextInterface{
    hasProvider:boolean,
    wallet:walletType,
    networkId:string

}


const WalletContext = createContext<walletContextInterface>({} as walletContextInterface)

export const WalletProvider:React.FC<{children:React.ReactNode}> = (props)=>{
    const [hasProvider, setHasProvider] = useState<boolean>(false)
    const [wallet, setWallet] = useState<walletType>({accounts: []})
    const [networkId,setNetworkId] = useState<string>("")


    useEffect(() => {
        const loadAccounts = async () => {
            try {
                if (window.ethereum) {
                    try {
                      if (window.ethereum.request) {
                        await window.ethereum.request({ method: 'eth_requestAccounts' });
                      } else if (window.ethereum.enable) {
                        await window.ethereum.enable(); 
                      }
                
                      const web3 = new Web3(window.ethereum);
                      const accounts = await web3.eth.requestAccounts();
                      const chainId = await web3.eth.getChainId();
                      setWallet({ accounts: [accounts[0]],chainId:chainId.toString() });
                      const netId = await web3.eth.net.getId(); 
                      setNetworkId(netId.toString())
                    } catch (error) {
                      console.error('Error connecting to Ganache:', error);
                    }
                  } else {
                    console.error('No Ethereum provider found. Please install MetaMask or use a browser with Ethereum support.');
                  }
            


            } catch (error) {
              console.error('Error loading accounts:', error);
            }
          };
          
        loadAccounts();
      }, []);
      

    return(
        <WalletContext.Provider value={{hasProvider,wallet,networkId}}>
            {props.children}
        </WalletContext.Provider>
    )
}

export const useWalletContext = () => useContext(WalletContext) 