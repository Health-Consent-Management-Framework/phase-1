import Web3 from "web3";
import { createContext, useContext, useEffect, useState } from "react";
import detectEthereumProvider from '@metamask/detect-provider'

type walletType = {
    accounts:string[],
    balance?: string
    chainId?: string
}

interface walletContextInterface{
    hasProvider:boolean,
    wallet:walletType,
    networkId:string,
    web3:Web3 | undefined
}


const WalletContext = createContext<walletContextInterface>({} as walletContextInterface)

export const WalletProvider:React.FC<{children:React.ReactNode}> = (props)=>{
    const [hasProvider, setHasProvider] = useState<boolean>(false)
    const [wallet, setWallet] = useState<walletType>({accounts: []})
    const [web3,setWeb3] = useState<Web3 | undefined>()
    const [networkId,setNetworkId] = useState<string>("")


    useEffect(() => {
        const checkProvider = async ()=>{
          const provider = await detectEthereumProvider()
          const chainId = await provider.request({
            method: 'eth_chainId'
          })
          if(chainId) setHasProvider(true)
        }
        const initWeb3 = async () => {
          try {
              const devMode = Boolean(import.meta.env.VITE_DEV_MODE)
              const provider = !devMode?window.ethereum:new Web3.providers.HttpProvider('http://localhost:7545')
              const web3 = new Web3(provider);
              setWeb3(web3)
            } catch (error) {
              console.error('Error loading accounts:', error);
            }
          };
        checkProvider();
        initWeb3();
    }, []);

    useEffect(()=>{
      async function loadAccounts(){
        if(web3){
          const devMode = Boolean(import.meta.env.VITE_DEV_MODE)
          const accounts = devMode? await web3.eth.getAccounts() : await web3.eth.requestAccounts();
          const chainId = await web3.eth.getChainId();
          setWallet({ accounts: accounts,chainId:chainId.toString() });
          const netId = await web3.eth.net.getId(); 
          console.log(netId)
          setNetworkId(netId?netId.toString():"start ganache")
      }
      
      }
      loadAccounts()
    },[web3])

    return(
        <WalletContext.Provider value={{hasProvider,wallet,networkId,web3}}>
            {props.children}
        </WalletContext.Provider>
    )
}

export const useWalletContext = () => useContext(WalletContext) 