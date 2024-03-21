import { useSearchParams } from "react-router-dom";
import useContract from "../../hooks/useContract";
import React, { useEffect, useState } from "react";
import { useCombinedContext } from "../../store";
import {abi as ReportAbi,networks as ReportNetwork} from '../../contracts/Report.json'

const ReportRequest:React.FC = ()=>{
    const {selectedWallet} = useCombinedContext()
    const reportContract = useContract(ReportAbi,ReportNetwork)
    const [verficationRequests,setVerificationRequests] = useState([])
    const [accessRequests,setAccessRequests] = useState([])
    const [searchParams] = useSearchParams()
    const [type,setType] = useState(()=>searchParams.get('type'))
    
    async function fetchVerificationRequest(){
        const reportId = searchParams.get('id')
        const data = await reportContract?.methods.getVerificationRequestForReport(reportId).call({from:selectedWallet})
        // if(data[0]==true)
        setVerificationRequests(data);
        return
    }

    async function fetchAccessRequest(){
        const reportId = searchParams.get('id')
        const data = await reportContract?.methods.getAccessRequests(reportId).call({from:selectedWallet})
        setAccessRequests(data)
        // console.log(requests)
        // return
    }

    useEffect(()=>{
        if(reportContract&&searchParams.get('id')){
            fetchVerificationRequest();
            fetchAccessRequest();
        }
    },[reportContract,searchParams])

    function getDate(number){
        console.log(number)
        if(number==0) return '-'
        const date = new Date(number);
        return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    }

    function getStatus(status){
        if(status==0){
            return `pending`
        }else if(status==1){
            return type=='access'?"approved":"verfied"
        }else if(status==2){
            return "rejected"
        }
    }

    function getWorker(id){
        if(!id||id=="0x0000000000000000000000000000000000000000"){return '-'}
        else return id
    }

    return(
        <section className="w-full">
            <div className="p-5 w-full">
                <table className="w-full rounded-lg shadow mx-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 bg-gray-200 text-center"></th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Report ID</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Created At</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Status</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">ApprovedBy</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">UpdatedAt</th>
                    </tr>
                </thead>
                <tbody>
                    {verficationRequests.sort((a,b)=>Number(b.createdAt)-Number(a.createdAt)).map((ele,index)=>(
                        <tr>
                            <td className="px-4 py-2 bg-gray-200 text-center">{index}</td>
                            <td className="px-4 py-2 bg-gray-200 text-center">
                                {ele.reportId}
                            </td>
                            <td className="px-4 py-2 bg-gray-200 text-center">
                                {getDate(Number(ele.createdAt))}
                            </td>
                            <td className="px-4 py-2 bg-gray-200 text-center">
                                {getStatus(Number(ele.status))}
                            </td>
                            <td className="px-4 py-2 bg-gray-200 text-center">
                                {getWorker(Number(ele.status))}
                            </td>
                            <td className="px-4 py-2 bg-gray-200 text-center">
                                {getDate(Number(ele.updatedAt))}
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </section>
    )
}

export default ReportRequest;