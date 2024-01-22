import { useState } from "react"
import { LabeledInput,Button, LabeledSelect } from "./ui"
import {useNavigate } from "react-router-dom"

export const Signup:React.FC = ()=>{
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [isDoctor,setIsDoctor] = useState(false)
    const handleSubmit = (e)=>{
        e.preventDefault();
        setLoading(true);
    }
    return(
        <section className="w-screen min-h-screen h-dvh flex items-center justify-center">
            <div className="left-side hidden sm:flex sm:w-1/2 bg-red-300 items-center justify-center h-full">
                <img src="/login.png" className="max-w-sm object-contain"/>
            </div>
            <div className="right-side w-full sm:w-1/2 flex flex-col justify-center items-center">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-[1px] border-red-500 sm:bg-transparent shadow-sm shadow-red-400 sm:shadow-none sm:border-0 py-5 rounded-2xl px-4">
                    <h1 className="text-4xl font-bold pb-5 text-center sm:text-left">Signup</h1>
                    <LabeledInput  label="UserName"/>
                    <LabeledInput type="password" label="password"/>
                    <LabeledInput type="password" label="confirm password"/>
                    <div className={`flex gap-3 pt-3`}>
                        <Button buttonType="primary" loader={loading}>Signup</Button>
                        <Button onClick={()=>navigate('/login')}>Login</Button>
                    </div>
                </form>
                <form>
                    <LabeledSelect onChange={(e)=>{
                        setIsDoctor(e.target.value==="doctor")
                 }} label="user type" options={[{name:"patient",value:"patient"},{name:"doctor",value:"doctor"}]}/>
                    {isDoctor&&<LabeledInput name="uid" label="uid"/>}
                </form>
            </div>
        </section>
    )
}
