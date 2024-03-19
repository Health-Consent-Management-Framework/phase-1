import Patient from "../components/Patient";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import { useUserContext } from "../store/userProvider";
import { routeConfig } from "../router";
import { useEffect, useMemo, useState } from "react";
import { useWalletContext } from "../store/walletProvider";
import {abi as PatientAbi,networks as PatientNetwork} from '../contracts/Patient.json'
import {abi as WorkerAbi,networks as WorkerNetwork} from '../contracts/Patient.json'
import {abi as DoctorAbi,networks as DoctorNetwork} from '../contracts/Doctor.json'
import {abi as ReportAbi,networks as ReportNetwork} from '../contracts/Report.json'
// import roleEnum from "./utils/enums";
import useContract from "../hooks/useContract";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dialog, DialogContent } from "@mui/material";
import { AddReport } from "./forms/addReport";

const Container = styled.div`
  background-color: #faf7f5;
  height: 100vh;
  padding: 10px 30px;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap:30px;
  flex-wrap:wrap;
`;
const Hr = styled.hr`
  margin: 12px 0px;
  border: 0.5px solid #aaaaaa;
`;


const PatientPage = () => {
  const {token,updateUser} = useUserContext()
  const {web3,wallet} = useWalletContext()
  const [queryParams,setQueryParams] = useSearchParams();
  const [reports,setReports] = useState([])
  const [loading,setLoading] = useState(false)
  const [role,setRole] = useState(()=>localStorage.getItem('role')) 
  const navigate = useNavigate()
  
  const menuConfig = useMemo(()=>({
    "patient":[
      {name:'report',onClick:()=>navigate(routeConfig.reports)},
      {name:'View Doctors',onClick:()=>navigate(routeConfig.doctors)},
      {name:'View Requests',onClick:()=>navigate(routeConfig.viewRequests)},
    ],
    doctor:[],
    worker:[],
    admin:[],
  }),[]) 

  useEffect(()=>{
  },[])

  const PatientContract = useContract(PatientAbi,PatientNetwork);
  const WorkerContract = useContract(WorkerAbi,WorkerNetwork);
  const DoctorContract = useContract(DoctorAbi,DoctorNetwork);
  const reportContract = useContract(ReportAbi,ReportNetwork);

  function handleReportPopUpClose(index:number){
    setQueryParams()
  }


  useEffect(()=>{
    async function fetchReports(){
      setLoading(true)
      const data = await reportContract?.methods.getPatientReports().call({from:wallet.accounts[0]})
      console.log(data)
      setReports(data)
      setLoading(false)
    }
    if(reportContract&&wallet.accounts) {
     fetchReports()
    }
  },[reportContract,wallet])
  
  return (
    <div className="flex">
      <SideNav data={menuConfig[role]} />
      <div className="w-full">
        <Container>
          <Patient />
          <Hr />
          <Wrapper>
            <Outlet/>
          </Wrapper>
          <Dialog
            PaperProps={{
              style: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
              },
            }}        
          onClose={handleReportPopUpClose} open={Boolean(queryParams.get('mode'))}>
              <DialogContent>
                <AddReport></AddReport>
              </DialogContent>
          </Dialog>
        </Container>
      </div>
    </div>
  );
};

export default PatientPage;
