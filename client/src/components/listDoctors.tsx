import useContract from "../hooks/useContract"
import {abi as DoctorAbi, networks as DoctorNetworks} from '../contracts/Doctor.json'
import React, { useEffect, useState } from "react"
import { BeatLoader } from "react-spinners"
import DoctorCard from "./ui/DoctorCardElement"
import { Dialog, Menu,DialogContent, MenuItem } from "@mui/material"
import {abi as RequestAbi,networks as RequestNetworks} from '../contracts/Request.json'
import { useCombinedContext } from "../store"
import { requestTypeEnum } from "./utils/enums"
import ViewAccessReports from "./accessListReport"
import {abi as ConnectionAbi,networks as ConnectionNetworks} from '../contracts/Connection.json'

const ListDoctors:React.FC = ()=>{
    const doctorContract = useContract(DoctorAbi,DoctorNetworks);
    const requestContract = useContract(RequestAbi,RequestNetworks);
    const connectionContract = useContract(ConnectionAbi,ConnectionNetworks);
    const {selectedWallet} = useCombinedContext();
    const [loading,setLoading] = useState(false);  
    const [doctors,setDoctors] = useState([])
    const [accessPopup,setAccessPopup] = useState(false)
    const [anchorEl,setAnchorEl] = useState<HTMLElement | null>(null)
    const [doctorId,setDoctorId] = useState('');
    
    async function getVerifiedDoctors(){
        setLoading(true)
        const verifedDoctors = await doctorContract?.methods.getVerifiedDoctors().call();
        console.log(verifedDoctors);
        setLoading(false)
        setDoctors(verifedDoctors)
    }

    useEffect(()=>{
        if(doctorContract) getVerifiedDoctors();
    },[doctorContract])

    function updateMenu(ele:HTMLElement,id:string){
        console.log(ele,id)
        setAnchorEl(ele);
        setDoctorId(id);
        console.log(id);
    }
    
    function handleMenuClose(){
        setAnchorEl(null)
        setDoctorId('')
    }

    async function createConnectionRequest(){
        const createdAt = new Date().getTime()
        const data = await requestContract?.methods.createAccountRequest(selectedWallet,`${selectedWallet} request for its account to be verified`,doctorId,createdAt,0,requestTypeEnum.connection).send({from:selectedWallet});
        // const data1 = await connectionContract?.methods.createConnection(doctorId,selectedWallet).send({from:selectedWallet});
        console.log("hello" + data1);
        
    }

    return(
        <section className="grow w-full pb-6">
            <div className="w-full flex items-center px-10 py-3 border-b-2  mb-2 justify-between">
                <h1 className="text-xl font-medium p-0">Doctors</h1>
            </div>
            <div className="w-full items-center justify-center">
                <BeatLoader loading={loading} size={10} color="blue"></BeatLoader>
            </div>
            <div className="flex gap-4 flex-wrap w-full">
                <></>
                {doctors.map((ele,index)=>(
                    <DoctorCard updateMenu={updateMenu} {...ele} key={index}/>
                ))}
                <Menu
                    anchorEl={anchorEl}
                    id="Doctor Menu"
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    
                    {/* <MenuItem onClick={()=>{setAccessPopup(true)}}>Give Access</MenuItem> */}
                    <MenuItem onClick={()=>{createConnectionRequest()}}>Connect</MenuItem>
                    {/* <MenuItem></MenuItem> */}
                </Menu>
            </div>
            <Dialog
            PaperProps={{
                style: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                },
              }}  
              maxWidth="lg"
            open={accessPopup} onClose={()=>setAccessPopup(false)}>
                <DialogContent>
                    <ViewAccessReports doctorAddress={doctorId}/>
                </DialogContent>
            </Dialog>
        </section>
    )
}

export default ListDoctors