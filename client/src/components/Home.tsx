import { useCombinedContext } from '../store'
import ProfileDetails from "../components/ProfileDetails"
import { Divider } from '@mui/material'
import {DocumentScanner} from '@mui/icons-material'

interface illustrationProps{
    icon?:React.ReactNode,
    image?:string,
    name:string,
    count:number
}

// const Container = styled.div`
//   background-color: #faf7f5;
//   height: 100%;
//   overflow-y:auto;
//   flex-grow:1;
// `;

// const Wrapper = styled.div`
//   display: flex;
//   align-items: center;
//   gap:30px;
//   flex-wrap:wrap;
// `;
// const Hr = styled.hr`
//   margin: 12px 0px;
//   border: 0.5px solid #aaaaaa;
// `;

const IllustrationIcon:React.FC<illustrationProps> = ({icon,name,count})=>{
    return(
        <article className='flex bg-slate-300 py-2 px-3 gap-4 rounded-md shadow-lg items-center'>
            <span className='bg-white shadow-lg rounded-full p-4'>
                {icon}
            </span>
            <span className='flex flex-col text-sm'>
                {name}
                <span className='text-center text-2xl font-medium'>{count}</span>
            </span>
        </article>
    )
}

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
        <section className='grow'>
            <div className="w-full flex items-center px-10 py-3 border-b-2  mb-2 justify-between">
                <h1 className="text-xl font-medium p-0">Home</h1>
            </div>
            <div className='p-1'>
                <div className='card bg-wheat-100 border-2 flex flex-col grow rounded-md py-8 px-10 shadow-sm w-full'>
                    <ProfileDetails />
                </div>
            </div>
            <div className='flex my-2 relative justify-around border-2 mx-2 pt-12 m-auto rounded-lg p-5'>
                <h1 className='absolute top-4 left-10 font-medium'>Status</h1>
                <IllustrationIcon icon={<DocumentScanner/>} name='No of Reports' count={33}/>
                <IllustrationIcon icon={<DocumentScanner/>} name='No of Connections' count={33}/>
                <IllustrationIcon icon={<DocumentScanner/>} name='New Notifications' count={33}/>
                <IllustrationIcon icon={<DocumentScanner/>} name='No of Reports' count={33}/>
            </div>
            <div className='border-2 mx-2 rounded-md p-2'>
                <h1 className='pt-2 ps-10 font-medium'>Network Info</h1>
                {walletInfo}
            </div>
        </section>

    )
}