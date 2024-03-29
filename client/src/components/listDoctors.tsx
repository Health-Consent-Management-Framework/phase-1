import useContract from "../hooks/useContract"
import {abi as DoctorAbi, networks as DoctorNetworks} from '../contracts/Doctor.json'
import { useEffect, useState } from "react"
import { BeatLoader } from "react-spinners"
import DoctorCard from "./ui/DoctorCardElement"
import avatar from '../assets/avatar.png'

interface Doctor{

}

const ListDoctors:React.FC = ()=>{
    const doctorContract = useContract(DoctorAbi,DoctorNetworks)
    const [loading,setLoading] = useState(false)    
    const [doctors,setDoctors] = useState([])
    const [menuExpand,setMenuExpand] = useState(-1)
    async function getVerifiedDoctors(){
        setLoading(true)
        const verifedDoctors = await doctorContract?.methods.getVerifiedDoctors().call();
        console.log(verifedDoctors);
        setLoading(false)
        setDoctors(verifedDoctors)
    }

    useEffect(()=>{
        if(doctorContract) getVerifiedDoctors();
    },[doctorContract])

    return(
        <section className="grow w-full pb-6">
            <h1 className="pb-2 text-2xl">Doctors</h1>
            <div className="w-full items-center justify-center">
                <BeatLoader loading={loading} size={10} color="blue"></BeatLoader>
            </div>
            <div className="flex gap-4 flex-wrap w-full">
                {doctors.map((ele,index)=>(
                    <DoctorCard menuExpand={menuExpand} setMenuExpand={setMenuExpand} {...ele} key={index}/>
                ))}
                {/* <DoctorCard></DoctorCard> */}
                {/* {JSON.stringify(doctors)} */}
            </div>
        </section>
    )
}

export default ListDoctors