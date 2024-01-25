import { useEffect, useState } from "react"
import { LabeledInput,Button, LabeledSelect } from "./ui"
import {useNavigate } from "react-router-dom"
import axios from "axios"
import { useNotificationContext } from "../store/notificationProvider"
import { useWalletContext } from "../store/walletProvider"
import {abi,networks} from '../contracts/Admin.json'
import { Contract } from "web3"

type ABI = typeof abi;

export const Signup:React.FC = ()=>{
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [isDoctor,setIsDoctor] = useState(false)
    const {web3,wallet,networkId} = useWalletContext();
    const {updateNotification} = useNotificationContext()
    const isDev = import.meta.env.VITE_DEV_MODE
    const [contract,setContract] = useState<Contract<ABI>>() 

    useEffect(()=>{
        if(web3&&networkId) initContract()
    },[web3,networkId])

    async function generateSignature(data){  
       return await web3?.eth.personal.sign(JSON.stringify(data),wallet.accounts[0],'')
    }

    const initContract = async () => {
        try {
          if(web3&&networkId){
            const deployedNetwork = networks[networkId];
            if(!deployedNetwork.address){
                throw new Error("Deploy the contract")
            }
            const instance = new web3.eth.Contract(
              abi,
              deployedNetwork.address
              );
              setContract(instance);
            }
        } catch (error) {
            updateNotification({type:"error",message:"contract not deployed"})
            console.error('Error initializing contract', error);
        }
    }


    const handleSubmit = async(e)=>{
        try{
            e.preventDefault();
            setLoading(true);
            const {username,password,confirmPassword,DoB,uid,walletId,fname,lname,type} = e.target
            if(confirmPassword.value!=password.value){
                throw new Error("password and confirm password doesn't match")
            }
            const signature = isDev? "some test signature" :await generateSignature({username:username.value,walletId:walletId.value})
            const body = {
                email:username.value,
                password:password.value,
                signature:signature,
                fname:fname.value,
                lname:lname.value,
                DoB:DoB.value,
                walletId:walletId.value,
                aadharNo:"1234567890",
                type:type.value
            }
            const res = await axios.post("http://localhost:5000/user/signup",body)
            setLoading(false)
            if(res.status==200){
                updateNotification({type:"success",message:"User created successfully"})
                navigate("/login")
            }else updateNotification({type:"error",message:res.data.message})
            console.log(res)
        }catch(err){
            console.error(err)
            updateNotification({type:"error",message:err.message||"something went wrong"})
            throw err
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
                    <div className="flex items-center justify-center">
                        <LabeledInput  label="first name" name="fname"/>
                        <LabeledInput  label="last name" name="lname"/>
                    </div>
                        <LabeledInput  label="Email" name="username"/>
                    <div className="flex  items-center">
                        <LabeledInput type="password" name="password" label="password"/>
                        <LabeledInput type="password" name="confirmPassword" label="confirm password"/>
                    </div>
                    <div className="flex items-center justify-center duration-500 flex-wrap md:flex-nowrap">
                        <LabeledInput type="date" name="DoB" label="date of birth"/>
                        <LabeledSelect onChange={(e)=>{
                            setIsDoctor(e.target.value==="doctor")
                         }} label="user type" name="type" options={[{name:"patient",value:"patient"},{name:"admin",value:"admin"}]}/>
                        {isDoctor&&<LabeledInput name="uid" label="uid"/>}
                    </div>
                    <div className="flex justify-center">
                        <LabeledSelect name="walletId" label="account" options={wallet.accounts.map(ele=>({value:ele,name:ele}))} />
                    </div>
                    <div className={`flex gap-3 justify-center pt-3`}>
                        <Button buttonType="primary" loader={loading}>Signup</Button>
                        <Button onClick={()=>navigate('/login')}>Login</Button>
                    </div>
                </form>
            </div>
        </section>
    )
}
