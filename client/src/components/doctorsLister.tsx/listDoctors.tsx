import { useEffect, useState } from 'react'
import {abi as DoctorAbi, networks as DoctorNetworks} from '../../contracts/Doctor.json'
import useContract from '../../hooks/useContract'
import { BeatLoader } from 'react-spinners'

export const ListDoctors:React.FC = ()=>{
    
    const [loading,setLoading] = useState(false)
    const contract = useContract(DoctorAbi,DoctorNetworks)
    const [doctors,setDoctors] = useState([])

    useEffect(()=>{
        async function FetchDoctors() {
            try{
                setLoading(true)
                const doctorData = await contract?.methods.getAllDoctors().call();
                if(doctorData){
                    setDoctors(doctorData)
                }else setDoctors([])
            }catch(err){
                console.log(err)
            }
            setLoading(false)
        }
        FetchDoctors()
    },[contract])

    return(
        <section className='relative w-full'>
            <div className='absolute top-2 left-1/2 -translate-x-1/2'>
                <BeatLoader size={10} loading={loading} color='blue'/>
            </div>
            <p className='w-full text-center'>Doctors are Listed here</p>
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