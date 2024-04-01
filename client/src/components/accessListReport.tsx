import dummyReport from '../assets/dummyReport.jpg'
import { Button } from "./ui"
import useContract from '../hooks/useContract'
import { abi as ReportAbi,networks as ReportNetworks } from '../contracts/Report.json'
import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { useCombinedContext } from '../store'


const ViewAccessReports:React.FC<{doctorAddress:string}> = (props)=>{

    const contract = useContract(ReportAbi,ReportNetworks)
    const [reports,setReports] = useState()
    const [loading,setLoading] = useState(false)
    const {selectedWallet} = useCombinedContext() 
    const [selectedReports,setSelectedReports] = useState<string[]>([])

    async function getReports(){
        try{
            setLoading(true)
            const data = await contract?.methods.getPatientReports(selectedWallet).call({from:selectedWallet});
            // console.log(data)
            setReports(data)
            setLoading(false)
        }catch(err){
            setLoading(false)
        }
    }

    async function submitAccess() {
        try {
            console.log(props.doctorAddress)
            setLoading(true);
            const promises = selectedReports.map(async ele => {
                const data = await contract?.methods.grantDoctorAccess(ele, props.doctorAddress).send({from:selectedWallet});
                return data;
            });
            console.log(promises)
            await Promise.all(promises);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    }

    function updateSelectedReports(reportId){
        setSelectedReports(prev=>prev.includes(reportId)?prev.filter(k=>reportId!==k):[...prev,reportId])
    }

    useEffect(()=>{
        if(contract){
            getReports()
        }
    },[contract])

    useEffect(()=>{
        console.log(selectedReports)
    },[selectedReports])

    return(
        <section className='relative max-w-[1000px] w-screen overflow-y-auto flex flex-col max-h-[500px] h-[95vh] bg-emerald-200'>
            <div className='w-full flex items-center justify-center'>
                <BeatLoader color='blue' loading={loading}/>
            </div>
            <div className="border-b-2 flex justify-between p-2 px-10">
                <h1 className="font-medium text-xl text-blue-700">User reports</h1>
                <Button onClick={submitAccess} className="border-blue-600 outline-blue-200 bg-blue-500 flex items-center gap-2 font-medium text-slate-100 hover:border-blue-300 hover:bg-blue-200 hover:text-blue-700">Confirm Access</Button>
            </div>
            <div className="w-full flex flex-wrap grow p-5 overflow-y-auto gap-4">
                {reports?.map(ele=><article className='bg-white flex relative flex-col p-2 shadow-md rounded-md w-[200px] h-[200px]'>
                    <input type='checkbox' 
                    onChange={()=>updateSelectedReports(ele.reportId)} 
                    color="primary" className="absolute z-10 right-2"/>
                    <img src={dummyReport} className="h-[100px] object-cover object-top"/>
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

export default ViewAccessReports;