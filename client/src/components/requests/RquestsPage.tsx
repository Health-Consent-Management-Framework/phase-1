import { useSearchParams } from "react-router-dom";
import { useCombinedContext } from "../../store";
import { useEffect, useState, useCallback } from "react";

import {abi as PatientAbi,networks as PatientNetwork} from '../../contracts/Patient.json'
import {abi as DoctorAbi,networks as DoctorNetwork} from '../../contracts/Doctor.json'
import {abi as WorkerAbi,networks as WorkerNetwork} from '../../contracts/Worker.json'
import {abi as AdminAbi,networks as AdminNetwork} from '../../contracts/Admin.json'

import ReportRequest from "./reportRequests";
import AccountRequest from "./AccountRequest";
import useContract from "../../hooks/useContract";

const RequestsMiddleware = ()=>{
    const {role,selectedWallet} = useCombinedContext()
    const [searchParams,setSearchPrams] = useSearchParams()
    const [requests,setRequests] = useState([])
    const [loading,setLoading] = useState(false)
    
    const patientContract = useContract(PatientAbi,PatientNetwork);
    const DoctorContract = useContract(DoctorAbi,DoctorNetwork);
    const WorkerContract = useContract(WorkerAbi,WorkerNetwork);
    const AdminContract = useContract(AdminAbi,AdminNetwork);
    
    useEffect(()=>{
        if(!['account','report'].includes(searchParams.get('type'))){setSearchPrams({type:'report'})}
    },[searchParams])


    
    const handleChange = (e)=>{
        const value = e.target.value;
        setSearchPrams({type:value})
    }

    const fetchReportRequest = ()=>{

    }

    useEffect(()=>{
        console.log(requests)
    },[requests])

    const fetchAccountRequests = useCallback(async()=>{
        if(role==1){
            const myRequests = await AdminContract?.methods.getAdminRequest(selectedWallet).call({from :selectedWallet});
            setRequests(myRequests)
        }else if(role==2){
            const myRequests = await WorkerContract?.methods.getWorkerRequest(selectedWallet).call({from :selectedWallet});
            setRequests(myRequests)
        }else if(role==3){
            const myRequests = await DoctorContract?.methods.getDoctorRequests(selectedWallet).call({from :selectedWallet});
            setRequests(myRequests)
        }else if(role==4){
            const myRequests = await patientContract?.methods.getPatientRequests(selectedWallet).call({from :selectedWallet})
            setRequests(myRequests)
        }
    },[AdminContract,WorkerContract,DoctorContract,patientContract])


    useEffect(()=>{
        if(searchParams&&fetchAccountRequests){
            fetchAccountRequests()
        }
    },[searchParams,fetchAccountRequests])

    return(
        <section className="w-full">
        <div className="w-full flex items-center justify-between">
            <article className="flex flex-col border-2 rounded-md p-2 border-black">
            <span className="font-medium text-sm">Report Id</span>
            </article>
            <div className="flex gap-4">
                <select onChange={handleChange} className="border-2 border-black rounded-xl p-2">
                    <option value={'account'} selected={searchParams.get('type')=='account'}>Account</option>
                    <option value={'report'} selected={searchParams.get('type')=='Report'}>Report</option>
                </select>
            </div>
        </div>
            {searchParams.get('type')=='report'&&<ReportRequest loading={loading} requests={requests}/>}
            {searchParams.get('type')=='account'&&<AccountRequest loading={loading} requests={requests}/>}
        </section>    
    )
}

export default RequestsMiddleware;