import useContract from "../hooks/useContract";
import {abi as ReportAbi,networks as ReportNetwork} from '../contracts/Report.json'
import ReportElement from "./ui/ReportCardElement";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dialog, DialogContent, Menu, MenuItem } from "@mui/material";
import {Add} from '@mui/icons-material'
import { AddReport } from "./forms/addReport";
import { BeatLoader } from 'react-spinners'
import { useCombinedContext } from "../store";
import { Button } from "./ui";
import { roleEnum } from "./utils/enums";
import { routeConfig } from "../router";

const PatientReports:React.FC = ()=>{
  const reportContract = useContract(ReportAbi,ReportNetwork);
  const [reports,setReports] = useState([])
  const {selectedWallet,role,updateNotification,user} = useCombinedContext()
  const [searchParams] = useSearchParams()
  const [isVerfied,setIsVerfied] = useState(false)
  const [loading,setLoading] = useState(false)
  const [reportPopUp,setReportPopUp] = useState(false)
  const [anchorEl,setAnchorEl] = useState<HTMLElement|null>(null); 
  const [id,setId] = useState('')

  const navigate = useNavigate();
  
  function updateMenuOpen(ele:HTMLElement,id:string,verfied:boolean){
    setAnchorEl(ele)
    setId(id)
    setIsVerfied(verfied)
  }

  function viewReport(id){
    navigate(routeConfig.viewReport(id));
  }

  function handleReportPopUpClose(){
    setReportPopUp(false)
  }

  async function fetchReports(){
    try{
      setLoading(true)
      let data;
      if(searchParams.get('mode')=='doctor'){
        data = await reportContract?.methods.getDoctorReports(selectedWallet).call({from:selectedWallet})
      }else{
        data = await reportContract?.methods.getPatientReports(selectedWallet).call({from:selectedWallet})
      }
      console.log(data)
      if(data){
        setReports(data)
      }else {
        updateNotification({type:"success",message:"Failed to fetch reports"})
      }
    }catch(err){
      setLoading(false)
    }
    setLoading(false)
  }
  
  useEffect(()=>{
    if(reportContract&&selectedWallet) {
      fetchReports()
    }
  },[reportContract, selectedWallet, updateNotification,searchParams])

  async function requestVerification(reportId){
    const date = new Date();
    const seconds = date.getTime();
    console.log(seconds)
    const data = await reportContract?.methods.createVerificationRequest(reportId,selectedWallet,seconds).send({from:selectedWallet});
    console.log(data)
  }

  async function DeleteReport(reportId){
    const data = await reportContract?.methods.deleteReport(reportId).send({from:selectedWallet});
    console.log(data)
    fetchReports();
  }

  async function viewReportRequests(reportId){
    navigate(`/home/requests/report?&id=${reportId}`)
  }

  async function handleMenuClose() {
    setAnchorEl(null)
    setId('')
  }


  return(
    <div className="w-full relative flex-col gap-4">
        <div className="w-full flex items-center px-10 py-3 border-b-2  mb-2 justify-between">
          <h1 className="text-xl font-medium p-0">Reports</h1>
          <div className="flex gap-2">
            <Button onClick={()=>{setReportPopUp(true)}} buttonType="dark" className={`p-0 flex gap-2 items-center shadow-sm ${role==1||role==2?"":""}`} >
              <Add/>
              <span>Add Report</span>
            </Button>
            {(roleEnum[role]=='admin'||roleEnum[role]=='worker')&&user.isVerified&&<Button onClick={()=>{setReportPopUp(true)}} className={`p-0 ${role==1||role==2?"":"bg-blue-400"}`} >Add Other Report</Button>}
          </div>
        </div>
        {!reports.length&&<p className="text-center w-full">These are your Reports</p>}
        <div className="w-full flex absolute top-2 left-1/2 -translate-x-1/2 items-center justify-center">
          <BeatLoader loading={loading} size={10} color="blue"/>
        </div>
        <div className="flex items-center p-4 flex-wrap gap-5">

        <Menu
            anchorEl={anchorEl}
            id="Doctor Menu"
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
          {/* {isVerfied&&<MenuItem>Give Access</MenuItem>} */}
          <MenuItem onClick={()=>{navigate(routeConfig.viewReport(id))}}>View Report</MenuItem>
          {!isVerfied&&<MenuItem onClick={()=>{requestVerification(id)}}>Request Verification</MenuItem>}
          <MenuItem>Delete Report</MenuItem>
      </Menu>

          {reports.map((ele,index)=>(
            <ReportElement viewRequests={viewReportRequests} viewReport={viewReport} reportId={ele.reportId} deleteReport={DeleteReport} requestVerification={requestVerification} verified={ele.isVerified} link={ele.attachements[0]} tags={ele.tags} key={index} index={index} updateMenuOpen={updateMenuOpen} disease={ele.problem} date={ele.date} />
          ))}
        </div>
        <Dialog
            PaperProps={{
              style: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
              },
            }}        
          onClose={handleReportPopUpClose} open={reportPopUp}>
              <DialogContent>
                <AddReport></AddReport>
              </DialogContent>
          </Dialog>
    </div>
    )
}

export default PatientReports