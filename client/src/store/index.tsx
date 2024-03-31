import Web3 from "web3";
import { createContext, useContext, useEffect, useState } from "react";
import detectEthereumProvider from '@metamask/detect-provider'
import { Modal,Backdrop } from "@mui/material";
import dayjs from 'dayjs';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

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
    const [role,setRole] = useState(()=>{
        if(localStorage.getItem('role')) return JSON.parse(localStorage.getItem('role'))
        else return {}
    })
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
          setUser(()=>e)
          localStorage.setItem('user',stringifiedUser)
    }

    function updateRole(e:number){
        setRole(()=>e)
        localStorage.setItem("role",JSON.stringify(e))
    }

    function updateWallet(e){
        setSelectedWallet(()=>e)
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
              setHasProvider(false)
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
            try{
                const netId = await web3.eth.net.getId(); 
                console.log(netId)
                setNetworkId(netId?netId.toString():"start ganache")
            }catch(err){
                setNetworkId('')
            }
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                {/* {hasProvider?children:
                <Modal 
                    open={!hasProvider}
                    slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                    }}
                    disableAutoFocus
                >
                    <section className="rounded-md w-screen h-screen flex items-center justify-center max-w-sm m-auto">
                        <div className="max-w-sm p-5 bg-amber-400 text-center rounded-md">
                            <span>Please Download MetaMask Wallet from the link below to continue</span>
                            <a href="https://metamask.io/download/" target="_blank" className="block text-blue-600 hover:text-violet-400 underline duration-300">Click here to Download</a>
                        </div>
                    </section>
                </Modal>
                }
                {!networkId&&
                (<Modal open={!networkId}>
                    <section className="w-screen items-center flex justify-center h-screen">
                        <div className="max-w-sm text-center bg-amber-300 p-5 rounded-md">
                            <p>Oops! looks like you need to start the blockchain network.</p>
                        </div>
                    </section>    
                </Modal>)} */}
            </CombinedContext.Provider>
        </LocalizationProvider>
    )
}

export const useCombinedContext = () => useContext(CombinedContext) as combinedContextProps