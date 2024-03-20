import { useNavigate } from "react-router-dom"
import { LabeledInput, LabeledSelect,Button } from "../ui"
import { useWalletContext } from "../../store/walletProvider"
import { useEffect, useState } from "react"
import {abi as facilityABI,networks as facilityNetworks} from '../../contracts/Facility.json'
import {abi as workerABI,networks as workerNetwork} from '../../contracts/Worker.json'
import useContract from "../../hooks/useContract"
import { useCombinedContext } from "../../store"


export const AddWorker:React.FC = ()=>{
    const navigate = useNavigate()
    const {wallet,web3} = useCombinedContext()
    const workerContract = useContract(workerABI,workerNetwork)
    const [loading,setLoading] = useState(false)
    function handleSubmit() {
        console.log("")
    }

    function handleSubmit(e){
        setLoading(true)
        const {fname,lname,email,DoB,facilityId} = e.target;
        setLoading(false)
    }

    return(
        <section className="m-auto flex items-center flex-col justify-center pt-10">
            <form onSubmit={handleSubmit} 
            className="flex flex-col bg-red-200 gap-2 border-2 border-red-500 shadow-lg py-5 rounded-2xl px-4">
                    <h1 className="text-4xl font-medium text-red-800 pb-5 text-center">Add Worker</h1>
                    <div className="flex items-center justify-center">
                        <LabeledInput outlineColor="red" textStyle="text-red-700 capitalize" label="first name" name="fname"/>
                        <LabeledInput outlineColor="red" textStyle="text-red-700 capitalize" label="last name" name="lname"/>
                    </div>
                        <LabeledInput textStyle="text-red-700 capitalize" label="Email" name="username"/>
                    <div className="flex items-center justify-center duration-500 flex-wrap md:flex-nowrap">
                        <LabeledInput textStyle="text-red-700 capitalize" type="date" name="DoB" label="date of birth"/>
                    </div>
                    <div className="flex justify-center">
                        <LabeledSelect textStyle="text-red-700 capitalize" name="facilityId" label="Facility" options={wallet.accounts.map(ele=>({value:ele,name:ele}))} />
                    </div>
                    <div className={`flex gap-3 justify-center pt-3`}>
                        <Button className="bg-red-500 text-white hover:border-red-700 hover:bg-red-300" buttonType="primary" loader={loading}>Add Worker</Button>
                        <Button className="hover:border-red-700 hover:text-red-700" onClick={()=>navigate('/login')}>Clear</Button>
                    </div>
            </form>
        </section>
    )
}