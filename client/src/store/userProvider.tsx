import { createContext, useContext,useEffect,useState } from "react";
import {abi as PatientAbi,networks as PatientNetwork} from '../contracts/Patient.json'
import {abi as WorkerAbi,networks as WorkerNetwork} from '../contracts/Patient.json'
import {abi as DoctorAbi,networks as DoctorNetwork} from '../contracts/Doctor.json'
import {abi as ReportAbi,networks as ReportNetwork} from '../contracts/Patient.json'
import useContract from "../hooks/useContract";

type User = {
    email:string,
    password:string,
    username:string,
    type:string,
}

interface UserContextInterface{
    user:User|undefined,
    updateUser:(ele:User)=>void,
    token:string,
    updateToken:(e:string,role:string)=>void
}


const UserContext = createContext<UserContextInterface|null>(null)

export const UserProvier:React.FC<{children:React.ReactNode}> = (props)=>{

    const [user,setUser] = useState<User>()
    const [role,setRole] = useState(()=>localStorage.getItem("access_token"))
    const [token,setToken] = useState(()=>{
        const userToken = localStorage.getItem("access_token")
        return userToken ? userToken:""
    })

    function updateUser(e){
        setUser(e)
    }

    function updateToken(e:string,role:string){
        setToken(e)
        setRole(role)
        localStorage.setItem("access_token",JSON.stringify(e))
    }

    return(
        <UserContext.Provider value={{user,updateUser,token,updateToken}}>
            {props.children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext) as UserContextInterface