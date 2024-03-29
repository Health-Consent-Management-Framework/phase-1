import { Divider } from "@mui/material";
import { useParams } from "react-router-dom"
import { Button } from "./ui";
import { DownloadSharp, Print, RemoveRedEye } from "@mui/icons-material";
import dummyReport from '../assets/dummyReport.jpg'

const ViewReport = ()=>{
    const params = useParams();
    return(
        <section className="flex grow flex-col">
            <div className="px-10 py-3 w-full">
                <h1 className="text-lg font-medium ">Report:<span className="text-[#545454] px-1 font-medium">{params.id}</span></h1>
            </div>
            <Divider/>
            <div className="my-5 flex flex-col grow">
                <div className="px-5 mb-4" aria-labelledby="report-header-info">
                    <div className="card border-2 rounded-md py-8 px-10 shadow-sm w-full">
                        <div className="flex flex-wrap justify-between">
                            <div className="flex gap-2">
                                <article>
                                    <img src={dummyReport} className="max-w-[200px] max-h-[100px] object-cover object-top"/>
                                </article>
                                <article className="items-start gap-2 flex flex-col">
                                    <h1 className="font-semibold text-xl flex items-center justify-center">Name:<span className="font-light text-sm mx-2 tracking-wide text-gray-400">report Name</span></h1>
                                    <h3 className="font-semibold text-xl flex items-center justify-center">Date:<span className="font-light text-sm mx-2 tracking-wide text-gray-400">Uploaded Date</span></h3>
                                    <article>
                                        <h6 className="font-semibold text-xl flex items-center justify-center">Tags:
                                            {
                                            ['report','inital crash'].map(ele=><span className="font-medium text-sm p-1 mx-2 rounded-lg bg-gray-200">{ele}</span>)
                                            }
                                        </h6>
                                    </article>
                                </article>
                            </div>
                            <article className="max-w-[300px] flex gap-4 justify-center items-center flex-wrap">
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
                            </article>
                        </div>
                    </div>
                </div>
                <div className="px-5 mb-4 flex flex-col grow">
                    <div className="flex h-full items-center">
                        <div className="w-1/2 rounded-md h-full p-2">
                            <article className="border-2 w-full h-full rounded-md">
                                <h1 className="ps-3 font-medium pt-4">Diagnosis</h1>
                            </article>
                        </div>
                        <div className="w-1/2 rounded-md h-full p-2">
                            <article className="border-2 w-full h-full rounded-md">
                                <h1 className="ps-3 font-medium pt-4">Requests</h1>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ViewReport