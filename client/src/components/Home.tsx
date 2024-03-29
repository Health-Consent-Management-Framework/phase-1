import { useCombinedContext } from '../store'


export const Home:React.FC = ()=>{
    const {selectedWallet,wallet,hasProvider,networkId} = useCombinedContext()


    const walletInfo = (
        <div className='bg-blue-400 border-2 w-fit p-3 text-center mx-auto'>        
            <h2 className='text-2xl'>Injected Provider { hasProvider ? 'DOES' : 'DOES NOT'} Exist</h2>
            <div className='text-2xl'>Wallet Accounts: { selectedWallet }</div>
            <div className='text-2xl'>ChainId: { wallet.chainId }</div>
            <div className='text-2xl'>NetworkId: { networkId }</div>
        </div>
    )
    
    return(
        <section className='grow items-center mt-20 justify-center flex'>
            {walletInfo}
        </section>

    )
}