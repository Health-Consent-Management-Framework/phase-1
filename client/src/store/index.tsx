import { WalletProvider } from "./walletProvider"

const Store:React.FC<{children:React.ReactNode}> = ({children}) =>{
    return(
        <WalletProvider>
            {children}
        </WalletProvider>
    )
}

export default Store