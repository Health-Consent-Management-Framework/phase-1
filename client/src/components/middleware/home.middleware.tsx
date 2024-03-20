import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import SideNav from "../ui/SideNav"
import ProfileDetails from "../ProfileDetails"
import styled from "styled-components";
import { useUserContext } from "../../store/userProvider";

import {abi as PatientAbi,networks as PatientNetwork} from '../../contracts/Patient.json'
import {abi as DoctorAbi,networks as DoctorNetwork} from '../../contracts/Doctor.json'
import {abi as WorkerAbi,networks as WorkerNetwork} from '../../contracts/Worker.json'
import {abi as AdminAbi,networks as AdminNetwork} from '../../contracts/Admin.json'
import useContract from "../../hooks/useContract";

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
    // const {updateUser} = useUserContext()
    const [loading, setLoading] = useState(true);
    const patientContract = useContract(PatientAbi,PatientNetwork)
    const workerContract = useContract(WorkerAbi,WorkerNetwork)
    const adminContract = useContract(AdminAbi,AdminNetwork)
    const doctorContract = useContract(DoctorAbi,DoctorNetwork)

    function handleNavigate(data){
        if(!data||data&&!data.walletAddress||data&&data.walletAddress.toLowerCase() === '0x0000000000000000000000000000000000000000'){
            navigate(`/details/add/${wallet}`)
        }else{
            // updateUser(data)
        }
    }


    useEffect(() => {
        async function fetchUserDetails() {
            const wallet = localStorage.getItem('walletId');
            const role = parseInt(localStorage.getItem('role'));
            console.log(role, wallet);

            if (role && wallet) {
                let data;

                if (role == 4) {
                    data = await patientContract?.methods.getPatient(wallet).call();
                } else if (role == 3) {
                    data = await doctorContract?.methods.getDoctors(wallet).call();
                } else if (role == 2) {
                    data = await workerContract?.methods.getSelfDetails(wallet).call();
                } else if (role == 1) {
                    data = await adminContract?.methods.getSelfDetails(wallet).call();
                }

                console.log(data);
                setLoading(false)
                if (data) {
                    if(!loading) handleNavigate(data);
                }
            }
        }

        if (!localStorage.getItem('role') || !localStorage.getItem('walletId')) {
            navigate('/auth');
        } else {
            fetchUserDetails();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientContract, doctorContract, workerContract, adminContract, handleNavigate]);

    
    useEffect(()=>{
    },[])

    return(
        <Outlet/>
    )
}

export default HomeMiddleware

