import {  useState } from "react"
import { Button, LabeledSelect } from "../ui"
import { useNavigate } from "react-router-dom"
import {abi as UserAbi,networks as UserNetwork} from '../../contracts/User.json'
import useContract from "../../hooks/useContract"
import { routeConfig } from "../../router"
import roleEnum from "../utils/enums"
import { useCombinedContext } from "../../store"


export const Signup:React.FC = ()=>{
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const {updateNotification,wallet} = useCombinedContext()
    const contract = useContract(UserAbi,UserNetwork) 

    const handleSubmit = async(e)=>{
        try{
            e.preventDefault();
            setLoading(true);
            const {walletId,type} = e.target
            const transaction = await contract?.methods.signup(type.value).send({from:walletId.value});
            setLoading(false)
            console.log(transaction)
            if(Number(transaction?.status)){
                const msg = `User with role ${roleEnum[type.value]} created`;
                navigate('/')
                updateNotification({type:"success",message:msg})
            }
        }catch(err){
            console.error(err)
            updateNotification({type:"error",message:"User creation failed"})
        }
    }
    
    return(
        <section className="w-screen min-h-screen h-dvh flex items-center justify-center">
            <div className="left-side hidden sm:flex sm:w-1/2 bg-red-300 items-center justify-center h-full">
                <img src="/login.png" className="max-w-sm object-contain"/>
            </div>
            <div className="right-side w-full sm:w-1/2 flex flex-col justify-center p-1 items-center">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-[1px] border-red-500 sm:bg-transparent shadow-sm shadow-red-400 sm:shadow-none sm:border-0 py-5 rounded-2xl px-4">
                    <h1 className="text-4xl font-bold pb-5 text-center sm:text-left">Signup</h1>
                    <div className="flex justify-center">
                        <LabeledSelect name="walletId" label="account" options={wallet.accounts.map(ele=>({value:ele,name:ele}))} />
                    </div>
                    <div className="flex items-center justify-center duration-500 flex-wrap md:flex-nowrap">
                        <LabeledSelect label="user type" name="type" options={[{name:"patient",value:4},{name:"worker",value:2},{name:"admin",value:1},{name:"doctor",value:3}]}/>
                    </div>
                    <div className={`flex gap-3 justify-center pt-3`}>
                        <Button type={'submit'} buttonType="primary" loader={loading}>Signup</Button>
                        <Button onClick={()=>navigate(routeConfig.login)}>Login</Button>
                    </div>
                </form>
            </div>
        </section>
    )
}
