import { useSearchParams } from "react-router-dom";
import useContract from "../../hooks/useContract";
import React, { useEffect, useState } from "react";
import { useCombinedContext } from "../../store";
import {abi as ReportAbi,networks as ReportNetwork} from '../../contracts/Report.json'
import { BeatLoader } from "react-spinners";


const ReportRequest:React.FC<propType> = ()=>{
    const {selectedWallet} = useCombinedContext()
    const reportContract = useContract(ReportAbi,ReportNetwork)
    const [requests,setRequests] = useState([])
    const [loading,setLoading] = useState(false)
    const [searchParams] = useSearchParams()
    
    function getDate(number){
        console.log(number)
        number = Number(number)
        if(number==0) return '-'
        const date = new Date(number);
        return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    }

    function getStatus(status){
        if(status==0){
            return `pending`
        }else if(status==1){
            return "approved"
        }else if(status==2){
            return "rejected"
        }
    }

    useEffect(()=>{
        if(reportContract){ 
            if(searchParams.get('user')=='other'){
                getAllRequests();
            }else getMyRequests();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[reportContract])

    async function getMyRequests(){
        console.log("called")
        if(reportContract){
            console.log("inside")
            const data = await reportContract.methods.getPatientReports(selectedWallet).call({from:selectedWallet})
            if(data) setRequests(data)
        }
    }

    async function getAllRequests(){
        const data = await reportContract?.methods.getOtherAccountRequests(selectedWallet).call({from:selectedWallet});
        console.log(data)
        if(data) setRequests(data)
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
                        <th className="px-4 py-2 bg-gray-200 text-center">UpdatedBy</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">UpdatedAt</th>
                    </tr>
                </thead>
                <tbody>
                    {loading&&<BeatLoader size={10} color="blue" loading={loading}></BeatLoader>}
                    {requests?.map((ele,index)=>(
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
                                {ele.updatedBy}
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