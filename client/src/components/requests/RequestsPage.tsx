import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import ReportRequest from "./reportRequests";
import AccountRequest from "./AccountRequest";

const RequestsMiddleware = ()=>{
    const [searchParams,setSearchParams] = useSearchParams()
    
    const updateParams = useCallback((value)=>{
        searchParams.set("type", value);
        setSearchParams(searchParams, { replace: true });
    },[searchParams,setSearchParams])

    
    useEffect(()=>{
        if(!['account','report'].includes(searchParams.get('type') as string)){
            updateParams("account");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchParams,updateParams])

    return(
        <section className="w-full">
        <div className="w-full flex items-center justify-between">
            <article className="flex flex-col p-2 border-black">
                <span className="font-medium text-lg">{searchParams.get('user')=='other'?"Other":"My"} Requests</span>
            </article>

            <div className="flex gap-4">
                <select onChange={(e)=>updateParams(e.target.value)} defaultValue={searchParams.get('type') as string} className="border-2 border-black rounded-xl p-2">
                    <option value={'account'}>Account</option>
                    <option value={'report'}>Report</option>
                </select>
            </div>
        </div>
            {searchParams.get('type')=='report'&&<ReportRequest/>}
            {searchParams.get('type')=='account'&&<AccountRequest/>}
        </section>    
    )
}

export default RequestsMiddleware;