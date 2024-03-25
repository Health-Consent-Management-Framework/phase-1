import useContract from "./useContract"
import {abi as UserAbi,networks as UserNetworks} from '../contracts/User.json'
import { useState } from "react"
import { useCombinedContext } from "../store"
import { useNavigate } from "react-router-dom"
import { routeConfig } from "../router"

export const useTransaction = ()=>{
    const [loading,setLoading] = useState(false)
    const {role,selectedWallet,updateNotification} = useCombinedContext();
    const userContract = useContract(UserAbi,UserNetworks);
    const navigate = useNavigate();

    async function checkStatus(){
        const data = await userContract?.methods.checkUserRole(role,selectedWallet).call({from:selectedWallet});
        if(data[0]==false){
            updateNotification({type:"error",message:"Invalid Request"});
            localStorage.clear();
            navigate(routeConfig.login);
        }
    }
    return {checkStatus,loading,setLoading}
}