import { useCallback, useEffect, useState } from "react"
import avatar from '../../assets/avatar.png'
import { Button, Divider, IconButton } from "@mui/material"
import { Add, Close, ModeEdit, TrySharp } from "@mui/icons-material"
import {abi as ReportAbi,networks as ReportNetworks} from '../../contracts/Report.json'
import { LabeledInput } from "../ui"
import { BeatLoader } from "react-spinners"
import useContract from "../../hooks/useContract"
import { useCombinedContext } from "../../store"
import { useParams } from "react-router-dom"

interface diagnosisType{
    text:string,
    date:number,
    doctorFname:string,
    doctorLname:string,
    walletAddress:string
}

interface propType{
    diagnosis:diagnosisType[]
}

const DiagnosisSection:React.FC<propType> = ()=>{
    const [edit,setEdit] = useState(false)
    const params = useParams()
    const [loading,setLoading] = useState(false)
    const reportContract = useContract(ReportAbi,ReportNetworks)
    const {selectedWallet,updateNotification,role} = useCombinedContext()
    const [diagnosis,setDiagnosis] = useState([])

    const submitDiagnosis = async(e)=>{
        try{
            e.preventDefault();
            const {diagnosis} = e.target;
            const date = new Date().getTime()
            console.log(date,diagnosis.value)
            const fname = "doctor"
            const lname = "one"
            const data = await reportContract?.methods.addDiagnosis(params.id,diagnosis.value,fname,lname,date).send({from:selectedWallet})
            console.log(data)
        }catch(err){
            console.log(err)
        }
    }

    const fetchDiagnosis = useCallback(async()=>{
        try{
            const data =await reportContract?.methods.getDiagnosis(params.id).call({from:selectedWallet})
            console.log(data)
            if(data){
                setDiagnosis(data)
            }
        }catch(err){
            console.log(err)
            updateNotification({type:"error",message:"something went wrong"})
        }

    },[reportContract])

    useEffect(()=>{
        if(fetchDiagnosis) fetchDiagnosis()
    },[fetchDiagnosis])

    

    return(
        <section className="border-2 flex flex-col w-full h-full rounded-md shadow-md bg-[#F5F7FB]">
            <article className="flex items-center px-5 justify-between">
                <h1 className=" font-medium py-4 text-xl pb-2">Diagnosis</h1>
                {role==3&&(
                <IconButton onClick={()=>setEdit(true)}>
                    <ModeEdit/>
                </IconButton>
                )}
            </article>
            <Divider/>
            <div className="flex relative flex-col overflow-y-auto custom-scroll-bar grow h-px p-3">
                {loading&&(
                    <article className="absolute top-0 w-full left-0 py-3 flex justify-center m-auto ">
                        <BeatLoader loading={loading} color="blue" size={10}/>
                    </article>
                )}
                {edit&&(
                    <form onSubmit={submitDiagnosis} className="flex items-center bg-white z-10 w-full absolute top-0 left-0 pb-4">
                        <LabeledInput label="diagnosis" name="diagnosis"/>
                        <Button type="submit" variant="outlined" sx={{mt:3,width:10}} color="success" className="">
                            <Add color="success"/>
                        </Button>
                        <Button type="button" variant="outlined" sx={{mt:3,width:10}} color="error" onClick={()=>setEdit(false)} className="">
                            <Close color="error"/>
                        </Button>
                    </form>
                )}
                {!diagnosis.length&&<p className="text-center">No diagnosis is Present. Wait while other doctor add the diagnosis</p>}
                {diagnosis?.map((ele,index)=>(
                    <article key={index} className="px-3 border-l-4 relative mb-3 pb-5 border-blue-700">
                        <span className="">{ele.text}</span>
                        <article className="absolute flex-row-reverse right-3 -bottom-2 flex items-center gap-2 font-medium" aria-label="name">
                            <img src={avatar} className="rouneded-full w-8 h-8"/>
                            <span className="text-blue-600 flex items-end text-sm flex-col pt-3">
                                {ele.doctorFname} {ele.doctorLname}
                                <span className="text-gray-600">
                                    {(new Date(Number(ele.date))).toISOString()}
                                </span>
                            </span>
                        </article>
                        <span className="w-3 h-3 absolute -left-2 top-[100%] inline-block rounded-full bg-blue-700" aria-label="ball"></span>
                    </article>
                ))}
            </div>
        </section>
       
    )
} 

export default DiagnosisSection