import { Divider } from "@mui/material";
import { useParams } from "react-router-dom"
import { Button } from "./ui";
import { DownloadSharp, Print, RemoveRedEye,Done } from "@mui/icons-material";
import dummyReport from '../assets/dummyReport.jpg'
import useContract from "../hooks/useContract";
import {abi as ReportAbi,networks as ReportNetworks} from '../contracts/Report.json'
import { useCombinedContext } from "../store";
import { useTransaction } from "../hooks/useTransaction";
import { useCallback, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import DoctorCard from "./ui/DoctorCardElement";
import AccessDoctors from "./ui/AccessDoctors";
import {
  abi as DoctorsAbi,
  networks as DoctorsNetworks,
} from "../contracts/Doctor.json";
import { useState } from "react";

const ViewReport = ()=>{
    const params = useParams();
    const reportContract = useContract(ReportAbi,ReportNetworks)
    const doctorContract = useContract(DoctorsAbi, DoctorsNetworks);
    const {selectedWallet} = useCombinedContext();
    // const [doctorsContract, setDoctorsContract] = useState(null);
    const [doctorsData, setDoctorsData] = useState([]);

    const getReport = useCallback(async()=>{
        return reportContract?.methods.getCompleteReport(params.id).call({from:selectedWallet})
    },[reportContract])


    const {loading,error,data:report} = useTransaction(getReport)

    useEffect(()=>{
        console.log(report)
    },[report])

    if(error){
        return <p>Something went wrong</p>
    }

    const getDoctors = useCallback(async (doctorAddress) => {
      const doctorData = await doctorContract.methods.getDoctorInfo(doctorAddress).call({ from: selectedWallet });
      return doctorData;
    }, [doctorContract, selectedWallet]);
  
    
    const fetchDoctorsData = useCallback(async () => {
        let mergedData = [];
        for (const ele of report?.doctorAddress) {
            // console.log(ele);
            const doctorData = await getDoctors(ele);
            // console.log(doctorData);
            if (doctorData) {
              mergedData.push(doctorData);
            }
          }
        console.log(mergedData);
        setDoctorsData(mergedData);
    }, [report, getDoctors]);
  
    useEffect(() => {
      fetchDoctorsData();
    }, [fetchDoctorsData]);

    return(
        <section className="flex h-full flex-col ">
            <div className="px-10 py-3 w-full">
                <h1 className="text-lg font-medium ">Report:<span className="text-[#545454] px-1 font-medium">{params.id}</span></h1>
            </div>
            <Divider/>
            <div className="my-5 flex flex-col grow">
                {loading?(
                    <div className="w-screen flex items-center justify-center">
                        <BeatLoader loading={loading} color="blue"/>
                    </div>
                ):(
                    <>
                        <div className="px-5 mb-4" aria-labelledby="report-header-info">
                            <div className="card border-2 rounded-md bg-[#F5F7FB] py-8 px-10 shadow-md w-full">
                                <div className="flex flex-wrap justify-between">
                                    <div className="flex items-center gap-2">
                                        <article>
                                            <img src={report?.attachements[0]} className="max-w-[200px] max-h-[100px] object-cover object-top"/>
                                        </article>
                                        <article className="items-start gap-2 flex flex-col">
                                            <h1 className="font-semibold text-xl flex items-center justify-center">Name:<span className="font-light text-sm mx-2 tracking-wide text-gray-400">{report?.problem}</span></h1>
                                            <h3 className="font-semibold text-xl flex items-center justify-center">Date:<span className="font-light text-sm mx-2 tracking-wide text-gray-400">Uploaded Date</span></h3>
                                            <article>
                                                <h6 className="font-semibold text-xl flex items-center justify-center">Tags:
                                                    {
                                                    report?.tags.map((ele,index)=><span key={index} className="font-medium text-sm p-1 mx-2 rounded-lg bg-gray-200">{ele}</span>)
                                                    }
                                                </h6>
                                            </article>
                                        </article>
                                    </div>
                                    <article className="max-w-[500px] flex gap-4 justify-center items-center flex-wrap">
                                        <Button className="border-gray-200 gap-2 font-medium flex items-center text-gray-500 hover:text-red-400">
                                            <DownloadSharp/>
                                            Download
                                        </Button>
                                        <Button className="border-gray-200 flex items-center gap-2 font-medium text-gray-500 hover:text-red-400">
                                            <RemoveRedEye/>
                                            View
                                        </Button>
                                        <Button className="border-gray-200 flex items-center gap-2 font-medium text-gray-500 hover:text-red-400">
                                            <Print/>
                                            Print
                                        </Button>
                                        {report&&!report.isVerified&&(
                                            <Button className="border-gray-200 flex items-center gap-2 font-medium text-gray-500 hover:text-red-400">
                                                <Done/>
                                                Request Verification
                                            </Button>                                        
                                        )}
                                        {report&&(
                                            <Button className="border-gray-200 flex items-center gap-2 font-medium text-gray-500 hover:text-red-400">
                                                View Requests
                                            </Button>
                                        )}
                                    </article>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 mb-4 flex flex-col grow">
                            <div className="flex h-full items-center">
                                <div className="w-1/2 rounded-md h-full p-2">
                                    <article className="border-2 w-full h-full rounded-md shadow-md bg-[#F5F7FB]">
                                        <h1 className=" font-medium pt-4 ps-5 text-xl pb-2">Diagnosis</h1>
                                        <Divider></Divider>
                                        <p className="ps-5">No thing to worry</p>
                                    </article>
                                </div>
                                <div className="w-1/2 rounded-md h-full p-2">
                                    <article className="border-2 w-full h-full rounded-md shadow-md bg-[#F5F7FB]">
                                        <h1 className="font-medium ps-5 pb-2 pt-4 text-xl">Doctors with access</h1>
                                        <Divider></Divider>
                                        {doctorsData.map((doctor, index) => (
                                          <AccessDoctors key={index} doctorData={doctor} />
                                        ))}
                                        {/* {report?.doctorAddress.map(ele=>(
                                            <p>{ele}</p>
                                        ))} */}
                                        <p className="ps-5">No thing to worry</p>
                                    </article>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default ViewReport