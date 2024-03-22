import { useSearchParams } from "react-router-dom";
import useContract from "../../hooks/useContract";
import React, { useEffect, useState } from "react";
import { useCombinedContext } from "../../store";
import {abi as ReportAbi,networks as ReportNetwork} from '../../contracts/Report.json'
import { BeatLoader } from "react-spinners";

interface propType{
    requests:any,
    loading:boolean
}

const ReportRequest:React.FC<propType> = (props)=>{
    const {selectedWallet} = useCombinedContext()
    const reportContract = useContract(ReportAbi,ReportNetwork)
    const [verficationRequests,setVerificationRequests] = useState([])
    const [searchParams] = useSearchParams()
    
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
            
        }else if(status==2){
            return "rejected"
        }
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
                    {props.loading&&<BeatLoader size={10} color="blue" loading={props.loading}></BeatLoader>}
                    {/* {props.requests.length&&props.requests?.map((ele,index)=>(
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
                    ))} */}
                </tbody>
                </table>
            </div>
        </section>
    )
}

export default ReportRequest;