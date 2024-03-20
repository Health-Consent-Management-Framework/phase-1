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
    const {updateUser,role,selectedWallet} = useCombinedContext()
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading,setLoading] = useState(true)
    const patientContract = useContract(PatientAbi,PatientNetwork)
    const workerContract = useContract(WorkerAbi,WorkerNetwork)
    const adminContract = useContract(AdminAbi,AdminNetwork)
    const doctorContract = useContract(DoctorAbi,DoctorNetwork)

    function handleNavigate(data,wallet){
        if(!data||data&&!data.walletAddress||data&&data.walletAddress.toLowerCase() === '0x0000000000000000000000000000000000000000'){
            navigate(`/home/addDetails/${wallet}`)
        }else{
            setIsCompleted(true)
            updateUser(data)
        }
    }


    useEffect(() => {
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role,patientContract,adminContract,workerContract,doctorContract]);

    
    useEffect(()=>{
        async function fetchUserDetails() {
            let data;
            if (role == 4) {
                data = await patientContract?.methods.getPatient(selectedWallet).call();
            } else if (role == 3) {
                data = await doctorContract?.methods.getDoctors(selectedWallet).call();
            } else if (role == 2) {
                data = await workerContract?.methods.getSelfDetails(selectedWallet).call();
            } else if (role == 1) {
                data = await adminContract?.methods.getSelfDetails(selectedWallet).call();
            }
            handleNavigate(data,selectedWallet);
        }
        if (!localStorage.getItem('role') || !localStorage.getItem('walletId')) {
            navigate('/auth');
        }else fetchUserDetails()
    },[])

    return(
        <Outlet/>
    )
}

export default HomeMiddleware

