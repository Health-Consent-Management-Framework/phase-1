import { useState } from "react"
import { AddAdmin, AddDoctor, AddWorker } from "."
import { AddPatient } from "./addPatient"

const AddDetails:React.FC = ()=>{
    const [role,] = useState(JSON.parse(localStorage.getItem('role')))
    // useEffect(()=>{},[role])
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