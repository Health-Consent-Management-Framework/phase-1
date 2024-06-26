import useContract from "../../hooks/useContract";
import { useCombinedContext } from "../../store";
import {abi as RequestAbi,networks as RequestNetwork} from '../../contracts/Request.json'
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { requestStatusEnum, requestTypeEnum } from "../utils/enums";
import { Delete, DeleteOutline, ThumbDown, ThumbUp} from '@mui/icons-material';
import { IconButton } from "@mui/material";
// import { makeStyles } from '@mui/styles'

// const useStyles = makeStyles(() => ({
//     disabledButton: {
//       backgroundColor: 'red', // Example styling for disabled state
//       color: 'black', // Example text color for disabled state
//       opacity: 0.5, // Example opacity for disabled state
//       pointerEvents: 'none', // Prevent click events on disabled button
//     },
//   }));


const AccountRequest:React.FC<{type:string}> = (props)=>{
    const {selectedWallet} = useCombinedContext()
    const requestContract = useContract(RequestAbi,RequestNetwork)
    const [requests,setRequests] = useState([])
    const [searchParams] = useSearchParams()

    function getDate(number){
        typeof number == 'bigint'?number = Number(number):''
        console.log(number)
        if(number==0) return '-'
        const date = new Date(number);
        return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    }

    function getStatus(status){
        typeof status == 'bigint'?status = Number(status):''
        if(status==0){
            return `pending`
        }else if(status==1){
            return "approved"
        }else if(status==2){
            return "rejected"
        }
    }

    async function getMyRequests(){
        console.log("called")
        if(requestContract){
            console.log("inside")
            const data = await requestContract.methods.getMyRequests(selectedWallet,requestTypeEnum[props.type]).call({from:selectedWallet})
            if(data) setRequests(data)
        }
    }

    async function getAllRequests(){
        const data = await requestContract?.methods.getOtherAccountRequests(selectedWallet).call({from:selectedWallet});
        console.log(data)
        if(data) setRequests(data)
    }

    function getRequestType(requestType){
        if(typeof requestType == 'string'){
            return requestTypeEnum[requestType];
        }
        const type = Object.keys(requestTypeEnum).find(ele=>Number(requestType)==requestTypeEnum[ele]);
        console.log(type)
        return type;
    }

    function getAddress(address){
        return parseInt(address, 16) === 0?'-':address
    }

    async function approveAccountRequest(requestId){
        const time = new Date().getTime()
        const transaction = await requestContract?.methods.ApproveAccountRequest(requestId,time).send({from:selectedWallet});
        console.log(transaction)
    }

    async function rejectAccountRequest(requestId){
        const time = new Date().getTime()
        const transaction = await requestContract?.methods.EditAccountStatus(requestId,requestStatusEnum.rejected,time).send({from:selectedWallet});
        console.log(transaction)
    }

    useEffect(()=>{
        if(requestContract){ 
            if(searchParams.get('user')=='other'){
                getAllRequests();
            }else getMyRequests();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[requestContract])

    return(
        <section className="w-full">
            <div className="p-5 w-full">
                <h1 className="text-sm font-medium text-blue-700">Account Verification Requests</h1>
                <table className="w-full rounded-lg shadow mx-auto">
                <thead>
                    <tr className="border-2 border-black">
                        <th className="px-4 py-2 bg-gray-200 text-center">-</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Request Id</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Request Type</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Created At</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Status</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Sent By</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">{searchParams.get('type')=='connection'?"RecievedBy":"Updated By"}</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Updated At</th>
                        <th className="px-4 py-2 bg-gray-200 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="border-2 border-red-400">
                    {requests?.map((ele,index)=>(
                        <tr key={index}>
                            <td className="px-4 py-2 bg-red-200 text-center">
                                {index}
                            </td>
                            <td className="px-4 py-2 bg-red-200 text-center">
                                {ele.requestId}
                            </td>
                            <td className="px-4 py-2 bg-red-200 text-center">
                                {getRequestType(ele.requestType)}
                            </td>
                            <td className="px-4 py-2 bg-red-200 text-center">
                                {getDate(ele.createdAt)}
                            </td>
                            <td className="px-4 py-2 bg-red-200 text-center">
                                {getStatus(Number(ele.requestStatus))}
                            </td>
                            <td className="px-4 py-2 bg-red-200 text-center">
                                <p className="max-w-[100px] overflow-hidden text-center text-ellipsis">
                                    {getAddress(ele.sentBy)}
                                </p>
                            </td>
                            <td className="px-4 py-2 bg-red-200 text-center">
                                <p className="max-w-[100px] overflow-hidden text-centerlis text-ellipsis">
                                    {getAddress(ele.updatedBy)}
                                </p>
                            </td>
                            <td className="px-4 py-2 bg-red-200 text-center">
                                {getDate(Number(ele.updatedAt))}
                            </td>
                            <td>
                                <article className="flex justify-center items-center">
                                    {searchParams.get('user')=='other'&&(
                                        <IconButton disabled={ele.requestStatus!=requestStatusEnum.pending} onClick={()=>approveAccountRequest(ele.requestId)}>
                                            <ThumbUp color="success"/>
                                        </IconButton>
                                    )}
                                    {searchParams.get('user')=='other'&&(
                                        <IconButton  disabled={ele.requestStatus!=requestStatusEnum.pending}  onClick={()=>rejectAccountRequest(ele.requestId)}>
                                            <ThumbDown color="error"/>
                                        </IconButton>
                                    )}
                                    {ele.sentBy.toLowerCase()==selectedWallet&&
                                    <IconButton disabled={ele.requestStatus!=requestStatusEnum.pending} onClick={()=>deleteRequest()}>
                                        <DeleteOutline color="error" />
                                    </IconButton>
                                    }
                                    {
                                        searchParams.get('type')=='connection'&&ele.updatedBy.toLowerCase()==selectedWallet&&(
                                        <IconButton disabled={ele.requestStatus!=requestStatusEnum.pending} onClick={()=>approveAccountRequest(ele.requestId)}>
                                            <ThumbUp color="success"/>
                                        </IconButton>
                                        )
                                    }
                                    {
                                        searchParams.get('type')=='connection'&&ele.updatedBy.toLowerCase()==selectedWallet&&(
                                        <IconButton  disabled={ele.requestStatus!=requestStatusEnum.pending}  onClick={()=>rejectAccountRequest(ele.requestId)}>
                                            <ThumbDown color="error"/>
                                        </IconButton>
                                        )
                                    }

                                </article>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </section>
    )
}

export default AccountRequest;