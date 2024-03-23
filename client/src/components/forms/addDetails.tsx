import { AddAdmin, AddDoctor, AddWorker } from "."
import { AddPatient } from "./addPatient"
import { Navigate } from "react-router-dom"
import { useCombinedContext } from "../../store"

const AddDetails:React.FC = ()=>{
    const {role,selectedWallet} = useCombinedContext()
    
    return role&&selectedWallet?(
        <>
            {role==4&&<AddPatient/>}
            {role==3&&<AddDoctor/>}
            {role==2&&<AddWorker/>}
            {role==1&&<AddAdmin/>}
        </>
    ):<Navigate to={'/auth'}/>
}

export default AddDetails