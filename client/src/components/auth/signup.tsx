import {  useState } from "react"
import { Button, LabeledInput, LabeledSelect } from "../ui"
import { useNavigate } from "react-router-dom"
import {abi as UserAbi,networks as UserNetwork} from '../../contracts/User.json'
import useContract from "../../hooks/useContract"
import { routeConfig } from "../../router"
import {roleEnum} from "../utils/enums"
import { useCombinedContext } from "../../store"
import { BeatLoader } from "react-spinners"


export const Signup:React.FC = ()=>{
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [type,setType] = useState()
    const {updateNotification,wallet} = useCombinedContext()
    const contract = useContract(UserAbi,UserNetwork) 

    const handleSubmit = async(e)=>{
        try{
            console.log("submitting")
            e.preventDefault();
            setLoading(true);
            const {walletId,type,AdminKey} = e.target
            const key = AdminKey?.value||''
            if(key){
                console.log(key)
                const transaction = await contract?.methods.signUpWithKey(key).send({from:walletId.value});
                // console.log(transaction)
                const events = transaction?.events;
                console.log(transaction)
                if(Object.keys(events).includes('UserCreated')){
                    const msg = `User with role ${roleEnum[type.value]} created`;
                    navigate('/')
                    updateNotification({type:"success",message:msg})
                }else{
                    updateNotification({type:"error",message:"failed to create the user"})
                }
            }else{
                const transaction = await contract?.methods.signup(type.value).send({from:walletId.value});
                const events = transaction?.events;
                console.log(transaction)
                if(Object.keys(events).includes('UserCreated')){
                    const msg = `User with role ${roleEnum[type.value]} created`;
                    navigate('/')
                    updateNotification({type:"success",message:msg})
                }else{
                    updateNotification({type:"error",message:"failed to create the user"})
                }    
            }

            setLoading(false)
        }catch(err){
            console.error(err)
            updateNotification({type:"error",message:"User creation failed"})
        }
    }

    
    return(
        <section className="w-screen min-h-screen h-dvh flex items-center justify-center">
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <BeatLoader loading={loading} color="red" size={5}/>
            </div>
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
                        {type==1&&(
                            <LabeledInput label="Admin Key"  name="AdminKey"/>
                        )}
                    </div>
                    <div className="flex items-center justify-center duration-500 flex-wrap md:flex-nowrap">
                        <LabeledSelect label="user type" name="type" onChange={(e)=>{setType(e.target.value)}} options={[{name:"patient",value:4},{name:"worker",value:2},{name:"admin",value:1},{name:"doctor",value:3}]}/>
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
