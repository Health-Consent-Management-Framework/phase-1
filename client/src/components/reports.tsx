import { LabeledInput, LabeledSelect } from "./ui"

export const Reports:React.FC = ()=>{
    return(
        <section className="flex flex-col items-center p-10">
            {/* <div className="patient-info">
                <article className="flex gap-5">
                    <p className="w-32">Paitent Name:</p>
                    <p>Vivek Yadav.P</p>
                </article>
                <article className="flex gap-5">
                    <p className="w-32">Paitent Email:</p>
                    <p className="w-32">vivekyadav3133@gmail.com</p>
                </article>
                <article className="flex gap-5">
                    <p className="w-32">Paitent wallet:</p>
                    <p className="w-32">0xF033e855D1B1FC5Ed6212cc768B644b0704256f5</p>
                </article>
            </div> */}
            <h1 className="text-2xl font-medium pb-5">View Your Reports</h1>
            <div className="flex">
                <div className="report-section max-w-[800px] w-screen flex flex-col relative">
                    <div className="search-filters flex justify-evenly">
                        <div className="max-w-sm">
                            <LabeledInput name="" label="Doctor"/>
                        </div>
                        <div className="max-w-sm">
                            <LabeledInput name="" label="date" type="date"/>
                        </div>
                        <div className="max-w-sm">
                            <LabeledSelect name="" label="attachment" options={[{value:"xray",name:"x-ray"}]}/>
                        </div>
                    </div>
                    <div className="flex-1 relative ">
                        <div className="p-4 pb-0 flex justify-between">
                            <span>Date</span>
                            <span>Report Name</span>
                            <span>Attachements</span>
                            <span>tags</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <article className="flex hover:scale-105 duration-200 hover:shadow-lg justify-between bg-blue-200 border-2 border-blue-500 rounded-md p-3">
                                <span>08-09-2001</span>
                                <span>Report-1</span>
                                <span>xray,mri</span>
                                <span>tags</span>
                            </article>
                            <article className="flex hover:scale-105 duration-200 hover:shadow-lg justify-between bg-blue-200 border-2 border-blue-500 rounded-md p-3">
                                <span>08-09-2001</span>
                                <span>Report-1</span>
                                <span>xray,mri</span>
                                <span>tags</span>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}