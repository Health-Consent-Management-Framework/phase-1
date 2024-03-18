/* eslint-disable no-unused-vars */
// import { useState, useEffect } from "react";
import {abi,networks} from '../contracts/Doctor.json';
import useContract from '../hooks/useContract';
import { useWalletContext } from '../store/walletProvider';
import SideNav from "./SideNav";
import PatientInfo from "./PatientInfo";
import data from "./Data";
import Navbar from "./Navbar";
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SlLogout } from "react-icons/sl";
import { MdFolderDelete } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";

const sideContent = [
  {
    key :1,
    icon : <IoIosNotifications />,
    name : "Requests"
  },
  {
    key :2,
    icon : <MdFolderDelete />,
    name : "Delete Account"
  },
  {
    key :3,
    icon : <SlLogout />,
    name :  "Logout"
  },
]

const DoctorPage = () => {
    const [doctor, setDoctor] = useState({});
    const [patient,setPatient] = useState([]);
    const { wallet } = useWalletContext();
    const contract = useContract(abi, networks);
    const location = useLocation();
    const navigate = useNavigate();
    const doctorAddress = location.state?.doctorAddress;
    useEffect(() => {
      async function getDoctor() {
        const transaction = await contract?.methods.getDoctorInfo(doctorAddress).call({ from: wallet.accounts[0] });
        setDoctor(transaction || {});
        // console.log(doctor);
      }
      getDoctor();
    },[contract, wallet]);

    useEffect(() =>{
      async function getPatients() {
          const transaction = await contract?.methods.getPatientsUnderDoctor(doctorAddress).call({ from: wallet.accounts[0] });
          setPatient(transaction || []);
      }
      getPatients();
  },[contract,wallet]);

  useEffect(() => {
    console.log(patient);
  }, [patient]);

    return (
        <div className="flex flex-col w-screen">
            <Navbar name={doctor.fname + " " + doctor.lname} designation={doctor.designation} />
            <div className="flex">
                <SideNav data={sideContent} />
                <div className="w-[80%] bg-[#faf7f5]">
                    {/* {patients.map(patient => (
                        <PatientInfo key={patient.key} contact={patient.contact} details={patient.details} />
                    ))} */}
                    {data.map(x => (
                        <PatientInfo key={x.key} contact={x.contact} details={x.details} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorPage;
