import { useEffect } from "react"
import { AddAdmin, AddDoctor, AddWorker } from "."
import { AddPatient } from "./addPatient"

const AddDetails:React.FC = ()=>{
    const role = JSON.parse(localStorage.getItem('role'))
    useEffect(()=>{},[role])
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