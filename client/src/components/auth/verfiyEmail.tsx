import { LabeledInput,Button, LabeledSelect } from "../ui"
import {Link, useNavigate } from "react-router-dom"
import { useWalletContext } from "../../store/walletProvider"
import { useUserContext } from "../../store/userProvider"
import {abi,networks} from '../../contracts/User.json'
import { useNotificationContext } from "../../store/notificationProvider"
import useContract from "../../hooks/useContract"

export const VerifyEmail:React.FC = ()=>{
    const navigate = useNavigate()
    const {web3,wallet} = useWalletContext()
    const {updateNotification} = useNotificationContext()
    const {updateToken,updateUser} = useUserContext()
    const contract = useContract(abi,networks)

    async function generateSignature(data){  
        return await web3?.eth.personal.sign(JSON.stringify(data),wallet.accounts[0],'')
     }

    const handleSubmit = async(e)=>{
        console.log(e)
        e.preventDefault();
        const isdev = import.meta.env.VITE_DEV_MODE
        const {userName,password,walletId,type} = e.target;
        const transaction = await contract?.methods.login(userName.value,password.value,walletId.value, Number(type.value)).send({from:walletId.value}) 
        console.log(transaction)
        if(transaction?.status){
            updateNotification({type:"success",message:"user logged in successfully"})
            navigate('/')
        }else{
            updateNotification({type:"error",message:"Unable to create transaction"})
        }
    }


    return(
        <section className="w-screen min-h-[100vh] h-1 flex items-center justify-center">
            <div className="left-side hidden sm:flex sm:w-1/2 bg-red-300 items-center justify-center h-full">
                <img src="/login.png" className="max-w-sm "/>
            </div>
            <div className="right-side w-full sm:w-1/2 flex flex-col justify-center items-center">
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 border-[1px] border-red-500 sm:bg-transparent shadow-sm shadow-red-400 sm:shadow-none sm:border-0 py-5 rounded-2xl px-4">
                    <h1 className="text-4xl font-bold pb-5 text-center sm:text-left">Add address</h1>
                    <div className="flex gap-3">
                    <LabeledInput inputStyle="bg-gray-300 font-medium" placeholder="your email address" label="Email" name="email" disabled={true}/>                        
                    <LabeledSelect label="user type" name="type" options={[{name:"patient",value:3,selected:true}]}/>
                    </div>
                    <LabeledSelect name="walletId" label="account" options={wallet.accounts.map(ele=>({value:ele,name:ele}))} />
                    <div className={`flex gap-3 `}>
                        <Button type="submit" buttonType="primary">Connect</Button>
                    </div>
                </form>
            </div>
        </section>
    )
}
