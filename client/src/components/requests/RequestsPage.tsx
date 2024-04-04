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
        if(!['account','report','access','connection'].includes(searchParams.get('type') as string)){
            updateParams("account");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchParams,updateParams])

    return(
    <section className="w-full">
        <div className="w-full flex items-center px-10 py-3 border-b-2  mb-2 justify-between">
            <h1 className="font-medium text-lg">{searchParams.get('user')=='other'?"Other":"My"} Requests</h1>
            <div className="flex gap-4">
                <select onChange={(e)=>updateParams(e.target.value)} defaultValue={searchParams.get('type') as string} className="border-2 border-black rounded-xl p-2">
                    <option value={'account'}>Account</option>
                    <option value={'report'}>Report Verification</option>
                    <option value={'access'}>Report Access</option>
                    <option value={'connection'}>Connection</option>
                </select>
            </div>
        </div>
            {searchParams.get('type')=='report'&&<ReportRequest type={"verification"}/>}
            {searchParams.get('type')=='access'&&<ReportRequest type={"access"}/>}
            {searchParams.get('type')=='account'&&<AccountRequest type={"verification"}/>}
            {searchParams.get('type')=='connection'&&<AccountRequest type={"connection"}/>}
        </section>    
    )
}

export default RequestsMiddleware;