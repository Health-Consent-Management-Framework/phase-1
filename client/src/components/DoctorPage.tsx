/* eslint-disable no-unused-vars */
// import { useState, useEffect } from "react";
import SideNav from "./SideNav";
import PatientInfo from "./PatientInfo";
import data from "./Data";
import Navbar from "./Navbar";
// import { collection, getDocs } from "firebase/firestore";
// import db from "../firebase";

const DoctorPage = () => {
    // const [patients, setPatients] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const querySnapshot = await getDocs(collection(db, "UserData"));
    //             const fetchedPatients = [];
    //             querySnapshot.forEach((doc) => {
    //                 fetchedPatients.push({ key: doc.id, ...doc.data() });
    //             });
    //             setPatients(fetchedPatients);
    //         } catch (error) {
    //             console.error("Error fetching patients:", error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    return (
        <div className="flex flex-col w-screen">
            {/* <Navbar /> */}
            <div className="flex">
                <SideNav />
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
