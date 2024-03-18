import { NotifcationProvider } from "./notificationProvider"
import { WalletProvider } from "./walletProvider"
import { UserProvier } from "./userProvider"

const Store:React.FC<{children:React.ReactNode}> = ({children}) =>{
    return(
        <WalletProvider>
                <UserProvier>
                    <NotifcationProvider>
                            {children}
                    </NotifcationProvider>
                </UserProvier>
        </WalletProvider>
    )
}

export default Store
