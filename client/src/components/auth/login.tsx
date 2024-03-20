import { Button, LabeledSelect } from "../ui"
import {Link, useNavigate } from "react-router-dom"
import { useWalletContext } from "../../store/walletProvider"
import { useUserContext } from "../../store/userProvider"
import {abi as UserAbi,networks as UserNetwork} from '../../contracts/User.json'
import { useNotificationContext } from "../../store/notificationProvider"
import useContract from "../../hooks/useContract"
import { routeConfig } from "../../router"

export const Login:React.FC = ()=>{
    const navigate = useNavigate()
    const {wallet} = useWalletContext()
    const {updateRole} = useUserContext()
    const {updateNotification} = useNotificationContext()
    const contract = useContract(UserAbi,UserNetwork)

    const handleSubmit = async(e)=>{
        try{
            console.log(e)
            e.preventDefault();
            const {walletId} = e.target;
            const data = await contract?.methods.checkIfUserExists(walletId.value).call();
            console.log(data)
            if(data){
                if(data[0]){
                    updateNotification({type:"success",message:data[2]})
                    navigate('/')
                    updateRole(Number(data[3]))
                    localStorage.setItem('walletId',walletId.value)
                    localStorage.setItem('role',JSON.stringify(Number(data[3])))
                }else{
                    updateNotification({type:"error",message:data[1]||"Unable to create transaction"})
                }
            }
        }catch(err){
            updateNotification({type:"error",message:"Unable to create transaction"})
            console.log(err.message)
        }
    }


    return(
        <section className="w-screen min-h-[100vh] h-1 flex items-center justify-center">
            <div className="left-side hidden sm:flex sm:w-1/2 bg-red-300 items-center justify-center h-full">
                <img src="/login.png" className="max-w-sm "/>
            </div>
            <div className="right-side w-full sm:w-1/2 flex flex-col justify-center items-center">
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 border-[1px] border-red-500 sm:bg-transparent shadow-sm shadow-red-400 sm:shadow-none sm:border-0 py-5 rounded-2xl px-4">
                    <h1 className="text-4xl font-bold pb-5 text-center sm:text-left">Login</h1>
                    <LabeledSelect name="walletId" label="account" options={wallet.accounts.map(ele=>({value:ele,name:ele}))} />
                    <div className="pt-1">
                        <p className="text-center p-0 m-0 text-sm">Not a user?
                            <Link to={routeConfig.signup}>
                                <span className="text-red-400 pl-1 hover:text-red-600 hover:underline duration-200 ">Signup</span>
                            </Link>
                        </p>
                    </div>
                    <div className={`flex gap-3 `}>
                        <Button type="submit" buttonType="primary">Connect</Button>
                    </div>
                </form>
            </div>
        </section>
    )
}


