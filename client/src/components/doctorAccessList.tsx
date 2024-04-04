import { Button } from "./ui"
import useContract from '../hooks/useContract'
import { abi as ReportAbi,networks as ReportNetworks } from '../contracts/Report.json'
import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { useCombinedContext } from '../store'

const DoctorViewAccessReports:React.FC<{doctorAddress:string}> = (props)=>{
    const contract = useContract(ReportAbi,ReportNetworks)
    const [reports,setReports] = useState()
    const [loading,setLoading] = useState(false)
    const {selectedWallet} = useCombinedContext() 

    async function getReports(){
        try{
            console.log("hello");
            setLoading(true);
            console.log(selectedWallet, props.doctorAddress);
            const data = await contract?.methods.getCurrentPatientDoctorAccessReport(selectedWallet,props.doctorAddress[0]).call({from:selectedWallet});
            setReports(data)
            setLoading(false)
        }catch(err){
            setLoading(false)
        }
    }

    useEffect(() =>{
        console.log(reports);
    },[reports])

    useEffect(()=>{
        if(contract){
            getReports()
        }
    },[contract])

    return(
        <section className='relative max-w-[1000px] w-screen overflow-y-auto flex flex-col max-h-[500px] h-[95vh] bg-emerald-200'>
            <div className='w-full flex items-center justify-center'>
                <BeatLoader color='blue' loading={loading}/>
            </div>
            <div className="border-b-2 flex justify-between p-2 px-10">
                <h1 className="font-medium text-xl text-blue-700"> Reports Access to Doctor</h1>
                <Button onClick={props.onClose} className="border-blue-600 outline-blue-200 bg-blue-500 flex items-center gap-2 font-medium text-slate-100 hover:border-blue-300 hover:bg-blue-200 hover:text-blue-700">Close</Button>
            </div>
            <div className="w-full flex flex-wrap grow p-5 overflow-y-auto gap-4">
                {reports?.map(ele=><article className='bg-white flex relative flex-col p-2 shadow-md rounded-md w-[200px] h-[200px]'>
                    <img src={ele.attachements[0]} className="h-[100px] object-cover object-top"/>
                    <span className="text-center pt-5 font-medium text-blue-500">{ele.problem}</span>
                    <article className="pt-1 flex justify-center items-center flex-wrap gap-2">
                        {ele.tags.map((k,index)=>(
                        <span key={index} className="p-1 text-[10px] px-2 rounded-xl max-w-[80px] overflow-hidden text-ellipsis border-[1px] bg-gray-200 font-medium">{k}</span>
                        ))}
                    </article>
                </article>)}
            </div>
        </section>
    )
}

export default DoctorViewAccessReports;