import useContract from "./useContract"
import {abi as UserAbi,networks as UserNetworks} from '../contracts/User.json'
import { useCallback, useEffect, useState } from "react"
import { useCombinedContext } from "../store"
import { useNavigate } from "react-router-dom"
import { routeConfig } from "../router"

export const useTransaction = (callback,auth?:boolean)=>{
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)
    const [data,setData] = useState(null)

    const {role,selectedWallet,updateNotification} = useCombinedContext();
    const userContract = useContract(UserAbi,UserNetworks);
    const navigate = useNavigate();
    


    useEffect(()=>{
        if(auth) (async()=>await checkStatus())()
        if(callback) callback().then((data)=>setData(data)).catch(err=>setError(err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[callback,auth])

    const checkStatus = useCallback(async()=>{
        const authState = await userContract?.methods.checkUserRole(role,selectedWallet).call({from:selectedWallet});
        if(authState&&authState[0]==false){
            navigate(routeConfig.login);
            updateNotification({type:'error',message:'Please login again'})
            setLoading(false);
            return;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[navigate, role, selectedWallet, userContract?.methods])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // async function transacte(callback:any,auth?:boolean) {
    //     try{
    //         setLoading(true)
    //         if(auth){
    //             const authData = await checkStatus();
    //             if(authData[0]==false){
    //                 navigate(routeConfig.login);
    //                 setLoading(false);
    //                 return;
    //             }
    //         }
    //         callback().then((data)=>{
    //             setLoading(false);
    //             setData(data)
    //             return data
    //         }).catch((err)=>{
    //             setError(err)
    //             setData(null)
    //             return null
    //         })
    //     }catch(err){
    //         setError(err.message);  
    //         updateNotification({type:"error",message:err.message})  
    //         setLoading(false)
    //     }
    // }

    return {data,loading,setLoading,error,setError,checkStatus}
}