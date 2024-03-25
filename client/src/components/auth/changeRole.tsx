import { LabeledInput,Button, LabeledSelect } from "../ui"
import { useNavigate } from "react-router-dom"
import {abi,networks} from '../../contracts/User.json'
import { useCombinedContext } from "../../store"
import useContract from "../../hooks/useContract"

const ChangeRole:React.FC = ()=>{
    const navigate = useNavigate()
    const {updateNotification,selectedWallet} = useCombinedContext()

    const contract = useContract(abi,networks)

    const handleSubmit = async(e)=>{
        console.log(e)
        e.preventDefault();
        const {role} = e.target;
        const transaction = await contract?.methods.changeUserRole(role.value).send({from:selectedWallet}) 
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
                    <LabeledInput label="WalletId" name="walletId" />
                    <LabeledSelect label="user type" name="type" options={[{name:"Patient",value:4},{name:"Doctor",value:3},{name:"Doctor",value:2},{name:"Patient",value:1}]}/>
                    </div>
                    <div className={`flex gap-3 `}>
                        <Button type="submit" buttonType="primary">Connect</Button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default ChangeRole;