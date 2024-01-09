import { useWalletContext } from '../store'

export const Home:React.FC = ()=>{
    const {wallet,hasProvider,networkId} = useWalletContext()
    const walletInfo = (
        <div className='bg-blue-400 border-2 w-fit p-3 text-center mx-auto'>        
        <h2>Injected Provider { hasProvider ? 'DOES' : 'DOES NOT'} Exist</h2>
        <div>Wallet Accounts: { wallet.accounts[0] }</div>
        <div>ChainId: { wallet.chainId }</div>
        <div>NetworkId: { networkId }</div>
        </div>
    )
    return(
        <section className='w-screen'>
            {walletInfo}
        </section>

    )
}