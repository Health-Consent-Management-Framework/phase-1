import dummyReport from '../assets/dummyReport.jpg'
import { CheckBox } from "@mui/icons-material"
import { Button } from "./ui"
import useContract from '../hooks/useContract'
import { abi as ConnectionAbi,networks as ConnectionNetworks } from '../contracts/Connection.json'
import { useEffect } from 'react'


const ViewAccessDoctors = ()=>{

    const contract = useContract(ConnectionAbi,ConnectionNetworks)

    async function getConnections(){
        const data = await contract?.methods.getConnections(selectedWallet).call({from:selectedWallet});
        console.log(data)
        // return data;
    }

    useEffect(()=>{
        if(contract){
            getConnections()
        }
    },[contract])

    return(
        <section className='relative max-w-[1000px] w-screen overflow-y-auto flex flex-col max-h-[500px] h-[95vh] bg-emerald-200'>
            <div className="border-b-2 flex justify-between p-2 px-10">
                <h1 className="font-medium text-xl text-blue-700">User reports</h1>
                <Button onClick={()=>{console.log("function here to grant report access to the users")}} className="border-blue-600 outline-blue-200 bg-blue-500 flex items-center gap-2 font-medium text-slate-100 hover:border-blue-300 hover:bg-blue-200 hover:text-blue-700">Confirm Access</Button>
            </div>
            <div className="w-full flex flex-wrap grow p-5 overflow-y-auto gap-4">
                {[1,2,3,5,1,1,1,1,1].map(_ele=><article className='bg-white flex relative flex-col p-2 shadow-md rounded-md w-[200px] h-[200px]'>
                    <CheckBox onClick={()=>{}} color="primary" className="absolute z-10 right-2"/>
                    <img src={dummyReport} className="h-[100px] object-cover object-top"/>
                    <span className="text-center pt-5 font-medium text-blue-500">Report Name</span>
                    <article className="pt-1 flex justify-center items-center flex-wrap gap-2">
                        <span className="p-1 text-[10px] px-2 rounded-xl max-w-[80px] overflow-hidden text-ellipsis border-[1px] bg-gray-200 font-medium">Report</span>
                        <span className="p-1 text-[10px] px-2 rounded-xl max-w-[80px] overflow-hidden text-ellipsis border-[1px] bg-gray-200 font-medium">Report</span>
                        <span className="p-1 text-[10px] px-2 rounded-xl max-w-[80px] overflow-hidden text-ellipsis border-[1px] bg-gray-200 font-medium">Report</span>
                    </article>
                </article>)}
            </div>
        </section>
    )
}

export default ViewAccessDoctors;