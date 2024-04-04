/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate, useSearchParams } from "react-router-dom";
import useContract from "../../hooks/useContract";
import React, { useEffect, useState } from "react";
import { useCombinedContext } from "../../store";
import {abi as ReportAbi,networks as ReportNetwork} from '../../contracts/Report.json'
import { BeatLoader } from "react-spinners";
import { IconButton } from "@mui/material";
import { ThumbDownOffAlt,ThumbUpOffAlt,AddTask } from "@mui/icons-material";
import { reportRequestTypeEnum, roleEnum } from "../utils/enums";
import { routeConfig } from "../../router";


const ReportRequest:React.FC = ()=>{
    const {selectedWallet,role} = useCombinedContext()
    const reportContract = useContract(ReportAbi,ReportNetwork)
    const [requests,setRequests] = useState([])
    const [loading,setLoading] = useState(false)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    
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
            const data = await reportContract.methods.getMyRequests(selectedWallet).call({from:selectedWallet})
            if(data) setRequests(data)
            console.log(data)
        }
    }


    async function approveVerfifcationRequest(requestId,reportId){
        const updatedAt = new Date().getTime()
        const data = await reportContract?.methods.approveVerificationRequest(reportId,requestId,updatedAt).send({from:selectedWallet})
        console.log(data)
    }

    async function rejectVerificationRequest(requestId,reportId){
        const updatedAt = new Date().getTime()
        const data = await reportContract?.methods.rejectVerificationRequest(requestId,reportId,updatedAt).send({from:selectedWallet})
        console.log(data)
    }

    async function approveAccessRequest(requestId,reportId){
        console.log(requestId, reportId);
        
        const data = await reportContract?.methods.approveAccessRequest(requestId,reportId).send({from:selectedWallet})
        console.log(data)
    }

    async function rejectAccessRequest(requestId,reportId) {
        const data = await reportContract?.methods.rejectAccessRequest(requestId,reportId).send({from:selectedWallet})
        console.log(data)
    }

    async function getAllRequests(){
        const data = await reportContract?.methods.getAllRequests(selectedWallet).call({from:selectedWallet});
        console.log(data)
        if(data) setRequests(data)
    }

    return(
        <section className="w-full">
            <div className="p-5 w-full">
                <table className="w-full rounded-lg shadow mx-auto">
                <thead>
                    <tr className="border-2 border-black">
                        <th className="px-4 py-2 bg-gray-200 text-center"></th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Report ID</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">SentBy</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Created At</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Status</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">RequestType</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">UpdatedBy/RecievedBy</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">UpdatedAt</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-blue-300 border-2 border-blue-500">
                    {loading&&<BeatLoader size={10} color="blue" loading={loading}></BeatLoader>}
                    {requests?.map((ele,index)=>(
                        <tr key={index}>
                            <td className="px-4 py-2 text-center">{ele.requestId}</td>
                            <td className="px-4 py-2 text-center">
                                <button className="bg-transparent text-blue-900 hover:opacity-85 underline" onClick={()=>{navigate(routeConfig.viewReport(ele.reportId))}}>
                                    {ele.reportId}
                                </button>
                            </td>
                            <td  className="px-4 py-2 text-center">
                                <p className="inline-block w-20 text-ellipsis overflow-hidden">
                                {ele.sentBy}
                                </p>
                            </td>
                            <td className="px-4 py-2 text-center">
                                {getDate(Number(ele.createdAt))}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {getStatus(Number(ele.status))}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {reportRequestTypeEnum[Number(ele.requestType)]}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {ele.updatedBy||'-'}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {getDate(Number(ele.updatedAt))}
                            </td>
                            <td>
                            {(reportRequestTypeEnum[Number(ele.requestType)]=="verification"&&(roleEnum[Number(role)]=="admin"||roleEnum[Number(role)]=='worker'))&&(
                                <td>
                                    <article className="flex justify-center items-center">
                                        <IconButton onClick={()=>approveVerfifcationRequest(ele.id,ele.reportId)}>
                                            <ThumbUpOffAlt color="success"/>
                                        </IconButton>
                                        <IconButton  onClick={()=>rejectVerificationRequest(ele.id,ele.reportId)}>
                                            <ThumbDownOffAlt color="error"/>
                                        </IconButton>
                                    </article>
                                </td>
                            )}
                            {reportRequestTypeEnum[Number(ele.requestType)]=="access"&&(
                                <td>
                                <article className="flex justify-center items-center">
                                    <IconButton onClick={()=>approveAccessRequest(ele.id,ele.reportId)}>
                                        <ThumbUpOffAlt color="success"/>
                                    </IconButton>
                                    <IconButton  onClick={()=>rejectAccessRequest(ele.id,ele.reportId)}>
                                        <ThumbDownOffAlt color="error"/>
                                    </IconButton>
                                </article>
                            </td>
                            )}
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