import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useNotificationContext } from "../store/notificationProvider";


export default function useAuth<T>(url:string,body:T){
    const [response,setResponse] = useState<AxiosResponse>()
    const {updateNotification} = useNotificationContext();
    const [error,setError] = useState<AxiosError>()
    const [loading,setLoading] = useState<boolean>(false)
    const urlConfig = {
        login:"user/login",
        signup:"user/signup",
        reset:"user/reset",
        forgot:"user/forgot"
    }
    useEffect(()=>{
        function fetch(){
            setLoading(true)
            const axiosInstance = axios.create({baseURL:"http://localhost:5000/"})
            axiosInstance.post(urlConfig[url],{body}).then((res)=>{
                setResponse(res.data)
            }).catch((err)=>{
                setError(err)
            })
        }
        if(body) fetch()
    },[body])
    useEffect(()=>{
        if(response?.data?.message) updateNotification({message:response.data.message,type:"success"})
        if(error?.message) updateNotification({message:error.message,type:"error"})
    },[response,error])
    return {response,loading,error}
}