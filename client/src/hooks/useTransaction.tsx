import useContract from "./useContract"
import {abi as UserAbi,networks as UserNetworks} from '../contracts/User.json'
import { useState } from "react"
import { useCombinedContext } from "../store"
import { useNavigate } from "react-router-dom"
import { routeConfig } from "../router"

export const useTransaction = ()=>{
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("")
    const {role,selectedWallet,updateNotification} = useCombinedContext();
    const userContract = useContract(UserAbi,UserNetworks);
    const navigate = useNavigate();

    async function checkStatus(){
        const data = await userContract?.methods.checkUserRole(role,selectedWallet).call({from:selectedWallet});
        return data;
    }

    async function transacte(callback:()=>void,auth?:bool) {
        try{
            setLoading(true)
            if(auth){
                const authData = await checkStatus();
                if(authData[0]==false){
                    navigate(routeConfig.login);
                    setLoading(false);
                    return;
                }
            }
            callback();
            setLoading(false);
        }catch(err){
            console.log(err);
            setError(err.message);  
            updateNotification({type:"error",message:err.message})  
            setLoading(false)
        }
    }

    return {transacte,loading,setLoading,error,setError,checkStatus}
}