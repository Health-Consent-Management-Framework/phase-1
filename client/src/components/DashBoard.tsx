import PatientFrom from './patientForm'
import { NameForm } from './nameForm'
export const DashBoard:React.FC = ()=>{
    return(
        <section className="">
            <div className="">
                <PatientFrom/>
                <NameForm/>
            </div>
        </section>
    )
}