import { useState,useEffect } from "react"
import { AddAdmin, AddDoctor, AddWorker } from "."
import { AddPatient } from "./addPatient"
import { useNavigate } from "react-router-dom"

const AddDetails:React.FC = ()=>{
    const [role,] = useState(JSON.parse(localStorage.getItem('role')))
    const navigate = useNavigate()
    useEffect(()=>{
        if(!localStorage.getItem('role')||!localStorage.getItem('walletId')){
            navigate('/auth')
        }
    },[])
    return(
        <>
            {role==4&&<AddPatient/>}
            {role==3&&<AddDoctor/>}
            {role==2&&<AddWorker/>}
            {role==1&&<AddAdmin/>}
        </>
    )
}

export default AddDetails