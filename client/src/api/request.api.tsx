import useContract from "../hooks/useContract"
import {abi as RequestAbi,networks as RequestNetworks} from '../contracts/Request.json'
import {useMutation} from '@tanstack/react-query'

interface createRequestBody{

}

const createRequest = async(contract,params)=>{
    const data = await contract.methods.CreateAccountRequest(...params);
    return data;
}

export const useCreateRequestMutation = (params)=>{
    const requestContract = useContract(RequestAbi,RequestNetworks);

    return useMutation({
        mutationFn:(params)=>createRequest(requestContract,params),
        mutationKey:['request-create',params]
    })
}