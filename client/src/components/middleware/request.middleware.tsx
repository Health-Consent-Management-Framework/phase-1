import { Outlet } from "react-router-dom";
import { LabeledSelect } from "../ui";

const RequestsMiddleware = ()=>{
    return(
        <section className="w-full">
        <div className="w-full flex items-center justify-between">
            <article className="flex flex-col border-2 rounded-md p-2 border-black">
            <span className="font-medium text-sm">Report Id</span>
            </article>
            <LabeledSelect label="Type" options={[{name:"verfifcation",value:"verification"},{name:"access",value:"access"}]}/>
        </div>
            <Outlet/>
        </section>    
    )
}

export default RequestsMiddleware;