import { LabeledInput,Button } from "./ui"
import {useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { useEffect, useState } from "react"

export const Login:React.FC = ()=>{
    const navigate = useNavigate()
    const [userDetails,setUserDetails] = useState<{username:string,password:string}|null>(null)
    const {response:loginResponse} = useAuth<{username:string,password:string}|null>("login",userDetails)

    const handleSubmit = (e)=>{
        console.log(e)
        e.preventDefault();
        const userName = e.target.userName;
        const password = e.target.password;
        setUserDetails({username:userName,password})
    }

    useEffect(()=>{
        console.log(loginResponse)
    },[loginResponse])

    return(
        <section className="w-screen min-h-screen h-dvh flex items-center justify-center">
            <div className="left-side hidden sm:flex sm:w-1/2 bg-red-300 items-center justify-center h-full">
                <img src="/login.png" className="max-w-sm object-contain"/>
            </div>
            <div className="right-side w-full sm:w-1/2 flex flex-col justify-center items-center">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-[1px] border-red-500 sm:bg-transparent shadow-sm shadow-red-400 sm:shadow-none sm:border-0 py-5 rounded-2xl px-4">
                    <h1 className="text-4xl font-bold pb-5 text-center sm:text-left">Login</h1>
                    <LabeledInput label="UserName"/>
                    <LabeledInput label="password"/>
                    <div className={`flex gap-3 pt-3`}>
                        <Button buttonType="submit" type="primary">Connect</Button>
                        <Button onClick={()=>navigate('/')}>Home</Button>
                    </div>
                </form>
            </div>
        </section>
    )
}
