import { useEffect, useState } from "react";
import { LabeledInput, LabeledSelect,Button } from "./ui"
import {abi ,networks} from '../contracts/Facility.json'
import { useWalletContext } from "../store/walletProvider";
import { useNotificationContext } from "../store/notificationProvider";
import useContract from "../hooks/useContract";
import { useNavigate } from "react-router-dom";


interface facility{
    facilityName:string,
    facilityType:string,
    street:string,
    pincode:string,
    state:string,
    district:string
}


export const AddFacility:React.FC = ()=>{
    const [facilty,setFacility] = useState<facility|null>()
    const {wallet} = useWalletContext();
    const contract = useContract(abi,networks)
    const {updateNotification} = useNotificationContext()
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = (e)=>{
        e.preventDefault();
        const {name,type,street,pincode,state,district} = e.target;
        console.log(name.value)
        setFacility({
            facilityName:name.value,
            facilityType:type.value,
            street:street.value,
            state:state.value,
            district:district.value,
            pincode:pincode.value
        })
    }
    

    
    useEffect(()=>{
        async function createFacility(){
            if(facilty){
                console.log(facilty)
                const transaction = await contract?.methods.createFacility(
                    facilty.facilityName,facilty.state,
                    facilty.district,facilty.street,facilty.pincode,facilty.facilityType
                ).send({from:wallet.accounts[0],gas:"5000000"})
                
                if(Number(transaction?.status)===0)
                    updateNotification({type:"success",message:"Failed to create facility"})
                else updateNotification({type:"success",message:"Facilty Created"})
            }
        }
        createFacility()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[facilty])
    

        return(
            <section className="w-full h-full items-center justify-center flex mt-16">
            <form onSubmit={handleSubmit} 
            className="flex flex-col bg-blue-200 gap-2 border-2 border-blue-500 shadow-lg py-5 rounded-2xl px-4">
                    <h1 className="text-4xl font-medium text-blue-800 pb-5 text-center">Add Facility</h1>
                    <div className="flex items-center justify-center gap-5">
                        <LabeledInput outlineColor="blue" textStyle="text-blue-700 capitalize" label="Facility Name" name="name"/>
                        <LabeledSelect textStyle="text-blue-700 capitalize" label="Facility Type" name="type" options={[{value:0,name:"Local"},{value:1,name:"State"},{value:2,name:"National"}]}/>
                    </div>
                    <div className="flex items-center justify-center duration-500 flex-wrap md:flex-nowrap">
                        <LabeledInput outlineColor="blue" textStyle="text-blue-700 capitalize" label="Street" name="street"/>
                        <LabeledInput outlineColor="blue" textStyle="text-blue-700 capitalize" label="Pincode" name="pincode"/>
                    </div>
                    <div className="flex justify-evenly">
                        <LabeledSelect textStyle="text-blue-700 capitalize" name="district" label="district" options={[{value:"District-1",name:"District-1"},{value:"District-2",name:"District-2"},{value:"District-3",name:"District-3"}]} />
                        <LabeledSelect textStyle="text-blue-700 capitalize" label="state" name="state" options={[{value:"state-1",name:"state-1"},{value:"state-2",name:"state-2"},{value:"state-3",name:"state-3"}]}/>
                    </div>
                    <div className={`flex gap-3 justify-center pt-3`}>
                        <Button className="bg-blue-500 hover:outline-blue-700 text-white hover:border-blue-700 hover:bg-blue-300" loader={loading}>Add Facility</Button>
                        <Button className="hover:border-blue-700 hover:text-blue-700" onClick={()=>navigate('/login')}>Clear</Button>
                    </div>
            </form>
        </section>
    )
}
