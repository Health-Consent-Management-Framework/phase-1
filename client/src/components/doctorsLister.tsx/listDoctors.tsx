import { useEffect, useState } from 'react'
import {abi as DoctorAbi, networks as DoctorNetworks} from '../../contracts/Doctor.json'
import useContract from '../../hooks/useContract'

export const ListDoctors:React.FC = ()=>{
    
    const [loading,setLoading] = useState(false)
    const contract = useContract(DoctorAbi,DoctorNetworks)
    const [doctors,setDoctors] = useState([])

    useEffect(()=>{
        async function FetchDoctors() {
            try{
                const doctorData = await contract?.methods.getAllDoctors().call();
                console.log("i am here")
                console.log(doctorData)
                // setDoctors(doctorData)
            }catch(err){
                console.log(err)
            }

        }
        FetchDoctors()
    },[])
    return(
        <section>
            {
                doctors.map(ele=>(
                    <>
                        {JSON.stringify(ele)}
                    </>
                ))
            }
        </section>
    )
}