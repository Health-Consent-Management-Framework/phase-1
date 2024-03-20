import { useEffect, useState } from "react";
import {abi ,networks} from '../contracts/Facility.json'
import useContract from "../hooks/useContract";
import { useCombinedContext } from "../store";
import { Button } from "./ui";
import { AddFacility } from "./forms/addFacility";
import { Dialog, DialogContent } from "@mui/material";

interface facility{
    facilityName:string,
    facilityType:string,
    location:{street:string,state:string,country:string},
}

export const Facilities:React.FC = ()=>{

    const [facilties,setFacilites] = useState<facility[]>([])
    const {wallet,updateNotification,role} = useCombinedContext();
    const contract = useContract(abi,networks)
    const [openPopup,setOpenPopUp] = useState(false)

    useEffect(()=>{
        console.log("called")
        async function getFacilites(){
            try{
                if(contract){
                    console.log("inside")
                    const data = await contract.methods.getFacilities().call({from:wallet.accounts[0]}) 
                    setFacilites(data as facility[])
                    console.log(data)
                }    
            }catch(err){
                updateNotification(err.message)
            }
        }
        getFacilites()
    },[contract])

    function getAccessType(type){
        switch(type){
            case '0':
                return 'local'
            case '1':
                return 'state'
            case '2':
                return 'national'
        }
    }

    function handleClose(){
        setOpenPopUp(false);
    }

    return(
        <section className="w-full">
            {role==1&&(<div className="w-full flex justify-end px-10 py-2">
                <Button onClick={()=>{setOpenPopUp(true)}} buttonType="dark" type="button">Add Facility</Button>
            </div>)}
            <div className="p-3" id="facilities-wrapper">
                <p className="text-center pb-4">These are facilities</p>
                <div className="flex justify-evenly">
                {facilties.map((ele,index)=>(                    
                    <article key={index} className="border-[1px] cursor-pointer border-black p-2 hover:border-red-200  duration-300 rounded-lg w-[200px] shadow-lg flex flex-col">
                        <img className="bg-red-200 h-24 rounded-lg w-full mb-2" />
                        <div className="flex flex-col">
                            <span className="uppercase font-bold text-sm">{ele.facilityName}</span>
                            <span className="w-full flex justify-between">
                            <span className="text-sm ">{getAccessType(ele.facilityType.toString())}</span>
                            <span className="text-xs font-bold inline-block ms-auto bg-red-200 rounded-md px-1 pt-[2px] uppercase">{`${ele.location.state}-${ele.location.district}`}</span>
                            </span>
                            <span className="text-xs text-justify px-2">this is some information about the facility on how it is to be made in the canopy and all</span>
                        </div>
                    </article>
                ))}
                </div>
                <></>
            </div>
            <Dialog
                PaperProps={{
                    style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    },
                }}
                open={openPopup} onClose={handleClose}>
                <DialogContent>   
                    <AddFacility/>
                </DialogContent>
                </Dialog>
        </section>
    )
}