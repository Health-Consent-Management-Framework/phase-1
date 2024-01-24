import { NotifcationProvider } from "./notificationProvider"
import { WalletProvider } from "./walletProvider"
import { UserProvier } from "./userProvider"
import { BrowserRouter as Router } from "react-router-dom"

const Store:React.FC<{children:React.ReactNode}> = ({children}) =>{
    return(
        <WalletProvider>
                <UserProvier>
                    <NotifcationProvider>
                        <Router>
                            {children}
                        </Router>
                    </NotifcationProvider>
                </UserProvier>
        </WalletProvider>
    )
}

export default Store
