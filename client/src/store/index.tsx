import { NotifcationProvider } from "./notificationProvider"
import { WalletProvider } from "./walletProvider"

const Store:React.FC<{children:React.ReactNode}> = ({children}) =>{
    return(
        <WalletProvider>
            <NotifcationProvider>
                {children}
            </NotifcationProvider>
        </WalletProvider>
    )
}

export default Store
export * from './walletProvider'