import { LabeledInput,Button } from "./ui"
import {Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export const Login:React.FC = ()=>{
    const navigate = useNavigate()
    const [userDetails,setUserDetails] = useState<{username:string,password:string}|null>(null)

    const handleSubmit = (e)=>{
        console.log(e)
        e.preventDefault();
        const userName = e.target.userName;
        const password = e.target.password;
        setUserDetails({username:userName,password})
    }

    useEffect(()=>{
        console.log(userDetails)
    },[userDetails])

    return(
        <section className="w-screen min-h-screen h-dvh flex items-center justify-center">
            <div className="left-side hidden sm:flex sm:w-1/2 bg-red-300 items-center justify-center h-full">
                <img src="/login.png" className="max-w-sm object-contain"/>
            </div>
            <div className="right-side w-full sm:w-1/2 flex flex-col justify-center items-center">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-[1px] border-red-500 sm:bg-transparent shadow-sm shadow-red-400 sm:shadow-none sm:border-0 py-5 rounded-2xl px-4">
                    <h1 className="text-4xl font-bold pb-5 text-center sm:text-left">Login</h1>
                    <LabeledInput label="UserName" name="userName"/>
                    <LabeledInput label="password" name="password" type="password"/>
                    <div className="pt-1">
                        <p className="text-center p-0 m-0 text-sm">Not a user?
                            <Link to={'/signup'}>
                                <span className="text-red-400 pl-1 hover:text-red-600 hover:underline duration-200 ">Signup</span>
                            </Link>
                        </p>
                    </div>
                    <div className={`flex gap-3 `}>
                        <Button type="submit" buttonType="primary">Connect</Button>
                        <Button onClick={()=>navigate('/forgot')}>Forgot Password</Button>
                    </div>
                </form>
            </div>
        </section>
    )
}
