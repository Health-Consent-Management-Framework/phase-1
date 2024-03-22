import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCombinedContext } from "../store";
import useContract from "./useContract";

import {abi as PatientAbi,networks as PatientNetwork} from '../contracts/Patient.json'
import {abi as DoctorAbi,networks as DoctorNetwork} from '../contracts/Doctor.json'
import {abi as WorkerAbi,networks as WorkerNetwork} from '../contracts/Worker.json'
import {abi as AdminAbi,networks as AdminNetwork} from '../contracts/Admin.json'

export const useHandleLogin = ()=>{
    console.log("hook called")
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
            console.log("inside handle Login",role,selectedWallet)
            try{
                updateWallet(selectedWallet)
                updateRole(role)
                if (role == 4) {
                    const Patientdata = await patientContract.methods.getPatient(selectedWallet).call();
                    if(Patientdata.walletAddress=="0x0000000000000000000000000000000000000000"){
                        navigate(`/addDetails/${selectedWallet}`)
                    }else{
                        navigate('/home')
                    }
                    updateUser(Patientdata)
                } else if (role == 3) {
                    const doctorData = await doctorContract.methods.getDoctors(selectedWallet).call();
                    if(doctorData.walletAddress=="0x0000000000000000000000000000000000000000"){
                        navigate(`/addDetails/${selectedWallet}`)
                    }else{
                        navigate('/home')
                    }
                    updateUser(doctorData); 
                } else if (role == 2) {
                   const workerData = await workerContract.methods.getWorker(selectedWallet).call();
                   if(workerData.walletAddress=="0x0000000000000000000000000000000000000000"){
                    navigate(`/addDetails/${selectedWallet}`)
                }else{
                    navigate('/home')
                }
                   updateUser(workerData); 
                } else if (role == 1) {
                    const adminData = await adminContract.methods.getAdmin(selectedWallet).call();
                    console.log(adminData)
                    if(adminData.walletAddress=="0x0000000000000000000000000000000000000000"){
                        navigate(`/addDetails/${selectedWallet}`)
                    }else{
                        navigate('/home')
                    }
                    updateUser(adminData); 
                }
            }catch(err){
                updateNotification({type:"error",message:err.message})
                console.log(err)
            }
        }
    }

}