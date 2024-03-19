import { useNavigate } from "react-router-dom"
import { LabeledInput, LabeledSelect,Button } from "../ui"
import { useWalletContext } from "../../store/walletProvider"
import { useEffect, useState } from "react"
import {abi as facilityABI,networks as facilityNetworks} from '../../contracts/Facility.json'
import {abi as workerABI,networks as workerNetwork} from '../../contracts/Worker.json'
import useContract from "../../hooks/useContract"


export const AddWorker:React.FC = ()=>{
    const navigate = useNavigate()
    const {wallet,web3} = useWalletContext()
    const facilityContract = useContract(facilityABI,facilityNetworks)
    const workerContract = useContract(workerABI,workerNetwork)
    const [facilites,setFacilites] = useState([])
    const [loading,setLoading] = useState(false)
    function handleSubmit() {
        console.log("")
    }

    useEffect(()=>{
        async function getFacilites(){
            const facilites = await facilityContract?.methods.getFacilites().call({from:wallet.accounts[0]})
            setFacilites(facilites)
        }
        if(facilityContract) getFacilites()
    },[facilityContract])

    function handleSubmit(e){
        const {fname,lname,email,DoB,facilityId} = e.target;
    }

    return(
        <section className="m-auto flex items-center flex-col justify-center pt-10">
            <form onSubmit={handleSubmit} 
            className="flex flex-col bg-blue-200 gap-2 border-2 border-blue-500 shadow-lg py-5 rounded-2xl px-4">
                    <h1 className="text-4xl font-medium text-blue-800 pb-5 text-center">Add Worker</h1>
                    <div className="flex items-center justify-center">
                        <LabeledInput outlineColor="blue" textStyle="text-blue-700 capitalize" label="first name" name="fname"/>
                        <LabeledInput outlineColor="blue" textStyle="text-blue-700 capitalize" label="last name" name="lname"/>
                    </div>
                        <LabeledInput textStyle="text-blue-700 capitalize" label="Email" name="username"/>
                    <div className="flex items-center justify-center duration-500 flex-wrap md:flex-nowrap">
                        <LabeledInput textStyle="text-blue-700 capitalize" type="date" name="DoB" label="date of birth"/>
                    </div>
                    <div className="flex justify-center">
                        <LabeledSelect textStyle="text-blue-700 capitalize" name="facilityId" label="Facility" options={wallet.accounts.map(ele=>({value:ele,name:ele}))} />
                    </div>
                    <div className={`flex gap-3 justify-center pt-3`}>
                        <Button className="bg-blue-500 text-white hover:border-blue-700 hover:bg-blue-300" buttonType="primary" loader={loading}>Add Worker</Button>
                        <Button className="hover:border-blue-700 hover:text-blue-700" onClick={()=>navigate('/login')}>Clear</Button>
                    </div>
            </form>
        </section>
    )
}