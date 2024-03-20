import { useCombinedContext } from '../store'

export const Home:React.FC = ()=>{
    const {wallet,hasProvider,networkId} = useCombinedContext()

    // async function decodeSignature(data) {
    //     try {
    //         const signature = localStorage.getItem('access_token') as string
    //         const dataString = '0x' + Buffer.from(JSON.stringify(data)).toString('hex');
    //         console.log(dataString)
    //         web3?.eth.personal.ecRecover(dataString, signature).then(()=>{

    //         })
    //     } catch (error) {
    //         console.error('Error decoding signature:', error);
    //         throw error;
    //     }
    // }

    const walletInfo = (
        <div className='bg-blue-400 border-2 w-fit p-3 text-center mx-auto'>        
        <h2>Injected Provider { hasProvider ? 'DOES' : 'DOES NOT'} Exist</h2>
        <div>Wallet Accounts: { wallet.accounts[0] }</div>
        <div>ChainId: { wallet.chainId }</div>
        <div>NetworkId: { networkId }</div>
        </div>
    )
    
    return(
        <section className='w-screen flex'>
            {walletInfo}
        </section>

    )
}