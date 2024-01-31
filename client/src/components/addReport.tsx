import { useEffect, useState } from "react";
import { LabeledInput, LabeledSelect,Button } from "./ui"
import {abi ,networks} from '../contracts/Report.json'
import { useWalletContext } from "../store/walletProvider";
import { useNotificationContext } from "../store/notificationProvider";
import useContract from "../hooks/useContract";

interface Report{
    patientId:string,
    doctorId:[string],
    attachements?:[string]
}


export const AddReport:React.FC = ()=>{
    const {wallet} = useWalletContext();
    const contract = useContract(abi,networks)
    const {updateNotification} = useNotificationContext()
    const [report,setReport] = useState()
    const [loading,setLoading] = useState(false)

    const handleSubmit = (e)=>{
        e.preventDefault();
        const {name,type,street,pincode,state,district} = e.target;
        console.log(name.value)
    }
    

    
    useEffect(()=>{
        async function createReport(){
                const transaction = await contract?.methods.createReport(
                    //add values here
                ).send({from:wallet.accounts[0],gas:"5000000"})
                
                if(Number(transaction?.status)===0)
                    updateNotification({type:"success",message:"Failed to create facility"})
                else updateNotification({type:"success",message:"Facilty Created"})
            }
        createReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[report])
    

        return(
            <section className="w-full h-full items-center justify-center flex mt-16">
            <form onSubmit={handleSubmit} 
            className="flex flex-col bg-blue-200 gap-2 border-2 border-blue-500 shadow-lg py-5 rounded-2xl px-4">
                    <h1 className="text-4xl font-medium text-blue-800 pb-5 text-center">Add Report</h1>
                    <div className="flex items-center justify-center gap-5">
                        <LabeledInput outlineColor="blue" textStyle="text-blue-700 capitalize" label="Facility Name" name="name"/>
                        <LabeledSelect textStyle="text-blue-700 capitalize" label="Facility Type" name="facilityType" options={[{value:0,name:"Local"},{value:1,name:"State"},{value:2,name:"National"}]}/>
                    </div>
                    <div className="flex items-center justify-center duration-500 flex-wrap md:flex-nowrap">
                        <LabeledInput outlineColor="blue" textStyle="text-blue-700 capitalize" label="Street" name="street"/>
                        <LabeledSelect options={[]} outlineColor="blue" textStyle="text-blue-700 capitalize" label="Pincode" name="pincode"/>
                    </div>
                    <div className="flex justify-evenly">
                        <LabeledSelect textStyle="text-blue-700 capitalize" name="district" label="district" options={[{value:0,name:"Local"},{value:1,name:"State"},{value:2,name:"National"}]} />
                        <LabeledSelect textStyle="text-blue-700 capitalize" name="state" label="state"  options={[{value:0,name:"Local"},{value:1,name:"State"},{value:2,name:"National"}]}/>
                    </div>
                    <div className={`flex gap-3 justify-center pt-3`}>
                        <Button className="bg-blue-500 text-white hover:border-blue-700 hover:bg-blue-300" buttonType="primary" loader={loading}>Add Worker</Button>
                        <Button className="hover:border-blue-700 hover:text-blue-700" onClick={()=>navigate('/login')}>Clear</Button>
                    </div>
            </form>
            </section>
    )
}
