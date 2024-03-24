import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCombinedContext } from "../store";
import useContract from "./useContract";

import {abi as PatientAbi,networks as PatientNetwork} from '../contracts/Patient.json'
import {abi as DoctorAbi,networks as DoctorNetwork} from '../contracts/Doctor.json'
import {abi as WorkerAbi,networks as WorkerNetwork} from '../contracts/Worker.json'
import {abi as AdminAbi,networks as AdminNetwork} from '../contracts/Admin.json'

export const useHandleLogin = ()=>{
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate();
    const {updateRole,updateNotification,updateUser,updateWallet} = useCombinedContext();

    const patientContract = useContract(PatientAbi,PatientNetwork);
    const doctorContract = useContract(DoctorAbi,DoctorNetwork);
    const workerContract = useContract(WorkerAbi,WorkerNetwork);
    const adminContract = useContract(AdminAbi,AdminNetwork);

    return {
        loading,setLoading,
        handleLogin:async (role:number,selectedWallet:string)=>{
            try{
                updateWallet(selectedWallet)
                updateRole(role)
                if (role == 4) {
                    const Patientdata = await patientContract.methods.getPatient(selectedWallet).call();
                    updateUser(Patientdata)
                    if(parseInt(Patientdata.walletAddress)==0){
                        navigate(`/addDetails/${selectedWallet}`)
                    }else{
                        navigate('/home')
                    }
                } else if (role == 3) {
                    const doctorData = await doctorContract.methods.getDoctors(selectedWallet).call();
                    updateUser(doctorData); 
                    if(parseInt(doctorData.walletAddress)==0){
                        navigate(`/addDetails/${selectedWallet}`)
                    }else{
                        navigate('/home')
                    }
                } else if (role == 2) {
                   const workerData = await workerContract.methods.getWorker(selectedWallet).call();
                    if(parseInt(workerData.walletAddress,16)==0)
                        navigate(`/addDetails/${selectedWallet}`)
                    else navigate('/home')    
                    updateUser(workerData); 
                } else if (role == 1) {
                    const adminData = await adminContract.methods.getAdmin(selectedWallet).call();
                    if(parseInt(adminData.walletAddress,16)==0)
                        navigate(`/addDetails/${selectedWallet}`)
                    else
                        navigate('/home')
                    
                    updateUser(adminData); 
                }
            }catch(err){
                updateNotification({type:"error",message:err.message})
                console.log(err)
            }
        }
    }
}