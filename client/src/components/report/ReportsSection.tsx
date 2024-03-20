import useContract from "../../hooks/useContract";
import {abi as ReportAbi,networks as ReportNetwork} from '../../contracts/Report.json'
import PatientReport from "./ReportCardElement";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useWalletContext } from "../../store/walletProvider";
import { Dialog, DialogContent } from "@mui/material";
import { AddReport } from "../forms/addReport";
import { BeatLoader } from 'react-spinners'
import { useUserContext } from "../../store/userProvider";

const PatientReports:React.FC = ()=>{
  const reportContract = useContract(ReportAbi,ReportNetwork);
  const [reports,setReports] = useState([])
  const {wallet} = useWalletContext()
  const [searchParams,setSearchPrams] = useSearchParams()
  const [loading,setLoading] = useState(false)
  const {user} = useUserContext()
  const [reportExpand,setReportExpand] = useState(-1); 

  function updateReportOpen(index:number){
    if(index==reportExpand) setReportExpand(-1)
    else setReportExpand(index)
  }

  function handleReportPopUpClose(){
    setSearchPrams()
  }
  
  useEffect(()=>{
    async function fetchReports(){
      setLoading(true)
      const data = await reportContract?.methods.getPatientReports().call({from:wallet.accounts[0]})
      setReports(data)
      setLoading(false)
    }
    if(reportContract&&wallet.accounts) {
     fetchReports()
    }
  },[reportContract,wallet])

  return(
    <div className="w-full relative pt-4 flex gap-4">
        <div className="w-full flex absolute top-2 left-1/2 -translate-x-1/2 items-center justify-center">
          <BeatLoader loading={loading} size={10} color="blue"/>
        </div>
        {reports.map((ele,index)=>(
            <PatientReport verified={ele.isVerified} link={ele.attachements[0]} tags={ele.tags} key={index} index={index} updateExpand={updateReportOpen} expand={reportExpand==index} disease={ele.problem} date={ele.date} />
          ))}
        <Dialog
            PaperProps={{
              style: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
              },
            }}        
          onClose={handleReportPopUpClose} open={Boolean(searchParams.get('mode'))}>
              <DialogContent>
                <AddReport></AddReport>
              </DialogContent>
          </Dialog>
    </div>
    )
}

export default PatientReports