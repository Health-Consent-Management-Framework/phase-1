import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import ReportRequest from "./reportRequests";
import AccountRequest from "./AccountRequest";
import { Suspense } from "react";

const RequestsMiddleware = ()=>{
    const [searchParams,setSearchParams] = useSearchParams()
    
    useEffect(()=>{
        if(!['account','report'].includes(searchParams.get('type'))){
            searchParams.set("type", "report");
            setSearchParams(searchParams, { replace: true });
        }
    },[searchParams])


    
    const handleChange = (e)=>{
        const value = e.target.value;
        searchParams.set("type", value);
        setSearchParams(searchParams, { replace: true });
    }

    return(
        <section className="w-full">
        <div className="w-full flex items-center justify-between">
            <article className="flex flex-col p-2 border-black">
                <span className="font-medium text-lg">My Requests</span>
            </article>

            <div className="flex gap-4">
                <select onChange={handleChange} className="border-2 border-black rounded-xl p-2">
                    <option value={'account'} selected={searchParams.get('type')=='account'}>Account</option>
                    <option value={'report'} selected={searchParams.get('type')=='Report'}>Report</option>
                </select>
            </div>
        </div>
            <Suspense fallback={<div>loading...</div>}>
                {searchParams.get('type')=='report'&&<ReportRequest/>}
                {searchParams.get('type')=='account'&&<AccountRequest/>}
            </Suspense>
        </section>    
    )
}

export default RequestsMiddleware;