/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from "styled-components";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MailIcon from "@mui/icons-material/Mail";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useEffect, useState } from "react";
import useContract from "../hooks/useContract";
import { abi, networks } from "../contracts/Patient.json";
import { useWalletContext } from "../store/walletProvider";
import { useNavigate, useLocation } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  gap: 25px;
  margin: 30px 0px;
`;
const Avatar = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 50%;
`;
const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;
const Name = styled.span`
  font-size: 23px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 17px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
  gap: 5px;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
`;
const InternalData = styled.div`
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 5px;
`;
const Data = styled.div`
  display: flex;
  gap: 50px;
  color: ${({ theme }) => theme.textSoft};
`;
const PatientDetails = styled.div`
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-top: 13px;
`;
const Doctor = styled.div`
  height: 30px;
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
`;
const DoctorDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Patient = () => {
  const [patient, setPatient] = useState({});
  const { wallet } = useWalletContext();
  const contract = useContract(abi, networks);
  const location = useLocation();
  const navigate = useNavigate();
  const patientAddress = location.state?.patientAddress;
  // console.log(patientAddress);
  useEffect(() => {
    async function getPatient() {
      const transaction = await contract?.methods.getPatient(patientAddress).call({ from: wallet.accounts[0] });
      setPatient(transaction || {});
      // console.log(patient);
    }
    getPatient();
  },[contract, wallet]);

  if (!patient) {
    return null;
  }

  const handleClick = async (e) => {
    try {
      e.preventDefault();
      if (contract) {
        await contract.methods.deletePatient(patientAddress).send({ from: wallet.accounts[0] });
        console.log('Patient deleted successfully');
        navigate("/");
      }
    } catch (error) {
      console.error('Error deleting data', error);
    }
  };

  return (
    <Container>
      <Avatar src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png" />
      <Details>
        <Name>{patient.fname} {patient.lname}</Name>
        <Data>
          <InternalData>
            <LocalPhoneIcon /> +91 9876543210
          </InternalData>
          <InternalData>
            <MailIcon />
            {patient.email}
          </InternalData>
          <InternalData>
            <CalendarMonthIcon />
            20-09-2023
          </InternalData>
        </Data>
        <PatientDetails>
          <Text>
            <span style={{ color: "#aaaaaa", fontWeight: "600" }}>GENDER </span>{" "}
            <span>Male</span>
          </Text>
          <Text>
            <span style={{ color: "#aaaaaa", fontWeight: "600" }}>AGE </span>{" "}
            <span>25</span>
          </Text>
          <Text>
            <span style={{ color: "#aaaaaa", fontWeight: "600" }}>HEIGHT </span>{" "}
            <span>180cm</span>
          </Text>
          <Text>
            <span style={{ color: "#aaaaaa", fontWeight: "600" }}>WEIGHT </span>{" "}
            <span>72kg</span>
          </Text>
          {/* <Text>
            <span style={{ color: "#aaaaaa", fontWeight: "600" }}>BMI </span>{" "}
            <span>23.3</span>
          </Text> */}
          <button className="hover:border-blue-700 hover:text-blue-700" onClick={handleClick}>Delete</button>
        </PatientDetails>
      </Details>
      <Doctor>
        <Avatar
          style={{ height: "50px", width: "50px" }}
          src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
        />
        <DoctorDetails>
          <span>Dr. John Doe</span>
          <span
            style={{ color: "#aaaaaa", fontWeight: "500", fontSize: "15px" }}
          >
            Cardiologist
          </span>
        </DoctorDetails>
      </Doctor>
    </Container>
  );
};

export default Patient;