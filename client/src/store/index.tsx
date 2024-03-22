import Web3 from "web3";
import { createContext, useContext, useEffect, useState } from "react";
import detectEthereumProvider from '@metamask/detect-provider'

interface Notification{
    type:"success"|"error"|"warning",
    message:string
}

interface NotificationContextProps{
    notification:Notification,
    updateNotification:(e:Notification)=>void
}

interface UserContextInterface{
    user:any,
    updateUser:(ele)=>void,
    role:number,
    updateRole:(ele:number)=>void;
}

type walletType = {
    accounts:string[],
    balance?: string
    chainId?: string
}

interface walletContextInterface{
    hasProvider:boolean,
    wallet:walletType,
    networkId:string,
    updateWallet:(e)=>void,
    selectedWallet:any,
    web3:Web3 | undefined
}

interface combinedContextProps extends NotificationContextProps{}
interface combinedContextProps extends walletContextInterface{}
interface combinedContextProps extends UserContextInterface{}


const CombinedContext = createContext<combinedContextProps|null>(null)

export const CombinedContextProvider:React.FC<{children:React.ReactNode}> = ({children}) => {
    const [notification,setNotification] = useState<Notification>({type:"success",message:"This is an Alert"})
    const [shownNotification,setShowNotification] = useState<boolean>(false)
    const [selectedWallet,setSelectedWallet] = useState(()=>{
        if(localStorage.getItem('walletId')) return localStorage.getItem('walletId')
        else return ''
    })
    const [user,setUser] = useState(()=>{
        if(localStorage.getItem('user')) return JSON.parse(localStorage.getItem('user'))
        else return {}
    })
    const [role,setRole] = useState(()=>localStorage.getItem("role")?JSON.parse(localStorage.getItem("role") as string):'')
    const [hasProvider, setHasProvider] = useState<boolean>(false)
    const [wallet, setWallet] = useState<walletType>({accounts: []})
    const [web3,setWeb3] = useState<Web3 | undefined>()
    const [networkId,setNetworkId] = useState<string>("")

    const updateNotification = ({type,message}:Notification)=>{
        setShowNotification(true)
        setNotification({type,message})
    }

    function updateUser(e){
        const stringifiedUser = JSON.stringify(e,(key, value) => {
            if (typeof value === 'bigint') {
              return value.toString();
            }
            return value;
          })
        localStorage.setItem('user',stringifiedUser)
        setUser(e)
    }

    function updateRole(e:number){
        setRole(role)
        console.log(e)
        localStorage.setItem("role",e)
    }

    function updateWallet(e){
        setSelectedWallet(e)
        localStorage.setItem('walletId',e)
    }



    useEffect(() => {
        const checkProvider = async ()=>{
          const provider = await detectEthereumProvider()
          const chainId = await provider?.request({
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
            console.log(accounts)
            const chainId = await web3.eth.getChainId();
            setWallet({ accounts: accounts,chainId:chainId.toString() });
            const netId = await web3.eth.net.getId(); 
            console.log(netId)
            setNetworkId(netId?netId.toString():"start ganache")
        }
        
        }
      loadAccounts()
    },[web3])

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setShowNotification(false)  
        },2000) 
        return ()=> clearTimeout(timer)
    },[shownNotification])

    function closeInvitation(){
        setShowNotification(false)
        setNotification({message:"",type:"success"})
    }

    return(
        <CombinedContext.Provider value={{
            notification,updateNotification,selectedWallet,updateWallet,
            updateRole,updateUser,role,wallet,networkId,user,hasProvider,web3
            }}>
            <div className={`inline-block duration-300 p-2 z-10 absolute ${shownNotification?`translate-y-[100px]`:`translate-y-[0px]`} -top-[100px] -translate-x-1/2 left-1/2`}>
                <article className="border-[1px] relative rounded-lg font-regular px-2 py-1 pr-6 w-[300px] text-center bg-white shadow-lg">
                    <p>{notification?.message}</p>
                    <button onClick={()=>{closeInvitation()}} className="absolute border-[1px] h-fit duration-300 rounded-2xl px-1 inline-block right-0 hover:border-red-500 top-1/2 -translate-y-1/2">
                        <i className="fa-solid fa-times fa-sm"></i>
                    </button>
                </article>
            </div>
            {children}
        </CombinedContext.Provider>
    )
}

export const useCombinedContext = () => useContext(CombinedContext) as combinedContextProps