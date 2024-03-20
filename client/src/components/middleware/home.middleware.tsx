import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

import {abi as PatientAbi,networks as PatientNetwork} from '../../contracts/Patient.json'
import {abi as DoctorAbi,networks as DoctorNetwork} from '../../contracts/Doctor.json'
import {abi as WorkerAbi,networks as WorkerNetwork} from '../../contracts/Worker.json'
import {abi as AdminAbi,networks as AdminNetwork} from '../../contracts/Admin.json'
import useContract from "../../hooks/useContract";
import { useCombinedContext } from "../../store";

const HomeMiddleware = ()=>{
    const navigate = useNavigate()
    const {updateUser,role,selectedWallet,user} = useCombinedContext()
    const patientContract = useContract(PatientAbi,PatientNetwork)
    const workerContract = useContract(WorkerAbi,WorkerNetwork)
    const adminContract = useContract(AdminAbi,AdminNetwork)
    const doctorContract = useContract(DoctorAbi,DoctorNetwork)

    function handleNavigate(wallet){
        if(user.walletAddress === '0x0000000000000000000000000000000000000000'){
            navigate(`/home/addDetails/${wallet}`)
        }
    }

    useEffect(()=>{
        if(user){
            handleNavigate(selectedWallet)
        }
    },[user])

    async function fetchUserDetails() {
        if (role == 4) {
            const Patientdata = await patientContract?.methods.getPatient(selectedWallet).call();
            console.log(Patientdata)
            updateUser(Patientdata); 
        } else if (role == 3) {
            const doctorData = await doctorContract?.methods.getDoctors(selectedWallet).call();
            updateUser(doctorData); 
        } else if (role == 2) {
           const workerData = await workerContract?.methods.getWorker(selectedWallet).call();
           updateUser(workerData); 
        } else if (role == 1) {
            const adminData = await adminContract?.methods.getSelfDetails(selectedWallet).call();
            updateUser(adminData); 
        }
    }

    useEffect(()=>{
        if(patientContract&&doctorContract&&adminContract&&workerContract) fetchUserDetails()
    },[patientContract,doctorContract,adminContract,workerContract])
    
    useEffect(()=>{
        if (!localStorage.getItem('role') || !localStorage.getItem('walletId')) navigate('/auth');
    },[])

    return(
        <Outlet/>
    )
}

export default HomeMiddleware

