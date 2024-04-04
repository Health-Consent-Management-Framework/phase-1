import { useEffect, useState } from "react";
import {abi ,networks} from '../contracts/Facility.json'
import useContract from "../hooks/useContract";
import { useCombinedContext } from "../store";
import { Button } from "./ui";
import { Add, MoreVert } from '@mui/icons-material'
import { AddFacility } from "./forms/addFacility";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { roleEnum } from "./utils/enums";

interface facility{
    facilityName:string,
    facilityType:string,
    facilityId:string,
    intro:string,
    location:{street:string,state:string,country:string},
}

export const Facilities:React.FC = ()=>{

    const [facilties,setFacilites] = useState<facility[]>([])
    const [menuExpand,setMenuExpand] = useState<number>()
    const {selectedWallet,updateNotification,role} = useCombinedContext();
    const contract = useContract(abi,networks)
    const [openPopup,setOpenPopUp] = useState(false)

    useEffect(()=>{
        console.log("called")
        async function getFacilites(){
            try{
                if(contract){
                    console.log("inside")
                    const data = await contract.methods.getFacilities().call({from:selectedWallet}) 
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

    function updateMenuOpen(index:number){
        if(index==menuExpand) setMenuExpand(-1)
        else setMenuExpand(index)
    }

    async function deleteFacility(id:string){
        const data = await contract?.methods.removeFacility(id).send({from:selectedWallet});
        console.log(data)
    }

    return(
        <section className="w-full">
            <div className="w-full flex items-center px-10 py-3 border-b-2  mb-2 justify-between">
                <h1 className="text-xl font-medium p-0">Facilities</h1>
                {role=='1'&&(
                <Button onClick={()=>{setOpenPopUp(true)}} className="flex gap-2 items-center"  buttonType="dark" type="button">
                    <Add/>
                    Add Facility
                </Button>
            )}
            </div>
            <div className="p-3" id="facilities-wrapper">
                <p className="text-center pb-4">These are facilities</p>
                <div className="flex gap-5 flex-wrap">
                {facilties.map((ele,index)=>(                    
                    <div key={index} className="relative border-[1px] cursor-pointer border-black p-2 hover:border-red-200  duration-300 rounded-lg w-[200px] shadow-lg flex flex-col">
                        {roleEnum[role]==='admin'&&(
                            <div className="absolute top-2 right-2">
                                <div className="relative">
                                    <IconButton onClick={()=>updateMenuOpen(index)}>
                                        <MoreVert/>
                                    </IconButton>
                                    {menuExpand==index&&(
                                        <article className="bg-blue-500 rounded-md z-10 absolute top-[100%] -right-[100%]">
                                            {/* <button className="bg-blue-500 my-[2px] hover:bg-sky-500 hover:text-white w-full duration-300 text-center whitespace-nowrap px-3 py-2">Edit Facility</button> */}
                                            <button onClick={()=>{deleteFacility(ele.facilityId)}} className="bg-blue-500 my-[2px] hover:bg-sky-500 hover:text-white w-full duration-300 text-center whitespace-nowrap px-3 py-2">Delete Facility</button>
                                        </article>
                                    )}
                                </div>
                            </div>
                        )}
                        <img className="bg-red-200 h-24 rounded-lg w-full mb-2" />
                        <div className="flex flex-col">
                            <span className="uppercase font-bold text-sm">{ele.facilityName}</span>
                            <span className="w-full flex justify-between">
                            <span className="text-sm ">{getAccessType(ele.facilityType.toString())}</span>
                            <span className="text-xs font-bold inline-block ms-auto bg-red-200 rounded-md px-1 pt-[2px] uppercase">{`${ele.location.state}-${ele.location.district}`}</span>
                            </span>
                            <span className="text-xs text-justify px-2">{ele.intro}</span>
                        </div>
                    </div>
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