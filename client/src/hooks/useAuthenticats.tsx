import { useNavigate } from "react-router-dom"
import useContract from "./useContract"
import {abi as UserAbi,networks as UserNetwork} from '../contracts/User.json'
import { useCallback, useEffect } from "react"
import { useCombinedContext } from "../store"
import { routeConfig } from "../router"


export const useAuthenticate = ()=>{
    const navigate = useNavigate()
    const userContract = useContract(UserAbi,UserNetwork)
    const {selectedWallet} = useCombinedContext()
    const [loading,setLoading] = useState(false);
    
    const authenticate = useCallback(async()=>{
        if(selectedWallet){
            if(userContract){
                const data = await userContract.methods.checkUserRole(selectedWallet).call({from:selectedWallet})
                if(data[0]==true){
                    navigate('/home')
                }else{
                    navigate(routeConfig.login)                    
                }
                console.log(data)
            }
        }else{
            navigate(routeConfig.login)
        }
    },[userContract,selectedWallet])

    return {authenticate,loading,setLoading}
}
