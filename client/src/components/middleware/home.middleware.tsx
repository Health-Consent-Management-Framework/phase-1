import { useEffect } from "react"
import { useAuthenticate } from '../../hooks/useAuthenticate'
import { Outlet, useNavigate } from "react-router-dom"

import styled from "styled-components";
import ProfileDetails from "../ProfileDetails"
import SideNav from "../ui/SideNav"

import {abi as PatientAbi,networks as PatientNetwork} from '../../contracts/Patient.json'
import {abi as DoctorAbi,networks as DoctorNetwork} from '../../contracts/Doctor.json'
import {abi as WorkerAbi,networks as WorkerNetwork} from '../../contracts/Worker.json'
import {abi as AdminAbi,networks as AdminNetwork} from '../../contracts/Admin.json'
// import {abi as UserAbi,networks as UserNetwork} from '../../contracts/User.json'

import useContract from "../../hooks/useContract";
import { useCombinedContext } from "../../store";

const Container = styled.div`
  background-color: #faf7f5;
  height: 100vh;
  flex-grow:1;
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


const HomeMiddleware = ()=>{
    const navigate = useNavigate()
    const {updateUser,user,role,selectedWallet} = useCombinedContext()
    const patientContract = useContract(PatientAbi,PatientNetwork)
    const workerContract = useContract(WorkerAbi,WorkerNetwork)
    const adminContract = useContract(AdminAbi,AdminNetwork)
    const doctorContract = useContract(DoctorAbi,DoctorNetwork)

    function handleNavigate(data){
        if(data.walletAddress === '0x0000000000000000000000000000000000000000'){
            navigate(`/addDetails/${selectedWallet}`)
        }else{
            console.log(data)
            updateUser(data)
        }
    }

    async function fetchUserDetails() {
        if (role == 4) {
            const Patientdata = await patientContract?.methods.getPatient(selectedWallet).call();
            handleNavigate(Patientdata); 
        } else if (role == 3) {
            const doctorData = await doctorContract?.methods.getDoctors(selectedWallet).call();
            handleNavigate(doctorData); 
        } else if (role == 2) {
           const workerData = await workerContract?.methods.getWorker(selectedWallet).call();
           handleNavigate(workerData); 
        } else if (role == 1) {
            const adminData = await adminContract?.methods.getAdmin(selectedWallet).call();
            handleNavigate(adminData); 
        }
    }

    useEffect(()=>{
        if(patientContract&&doctorContract&&adminContract&&workerContract&&selectedWallet) fetchUserDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[patientContract,doctorContract,adminContract,workerContract,selectedWallet])
    
    useEffect(()=>{
        if (!localStorage.getItem('role') || !localStorage.getItem('walletId')) navigate('/auth');
    },[])



    async function requestVerification(){
        const selectedWallet = localStorage.getItem('walletId')
        const role = localStorage.getItem('role')
        const createdAt = new Date().getTime()
        console.log(role)
        if(selectedWallet){
            if(role=='3'){
                const doctorData = await doctorContract?.methods.createVerificationRequest(createdAt).send({from:selectedWallet});
                console.log(doctorData)
            }else if(role=='2'){
                const workerData = await workerContract?.methods.createRequest(user.email,'verify',createdAt).send({from:selectedWallet})
                console.log(workerData)
            }else if(role=='1'){
                const adminData = await adminContract?.methods.createVerificationRequest(createdAt).send({from:selectedWallet})
                console.log(adminData)
            }
        }
    }

    function deleteAccount(){

    }

    return(
        <section className="h-screen flex">
            <SideNav requestVerification={requestVerification} deleteAccount={deleteAccount}/>
            <Container>
                <ProfileDetails />
                <Hr />
                <Wrapper>
                    <Outlet/>
                </Wrapper>
            </Container>
        </section>
    )
}

export default HomeMiddleware

