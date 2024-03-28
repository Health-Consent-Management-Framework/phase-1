/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from "styled-components";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MailIcon from "@mui/icons-material/Mail";
import { useCallback } from "react";
import { useCombinedContext } from "../store";
import { roleEnum } from "./utils/enums";

const Container = styled.div`
  display: flex;
  gap: 25px;
  justify-content:space-evenly;
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

const ProfileDetails = () => {
  const {role,user} = useCombinedContext();

  const calculateAge = useCallback((year)=>{
    const givenYear = new Date(year)
    const curr_year = new Date()
    return curr_year.getFullYear() - givenYear.getFullYear();
  },[])

  const getDoB = useCallback((dob)=>{
    const date = new Date(Number(dob));
    return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`    
  },[])


  function getRole(){
    if(role==1) return 'Admin'
    else if(role==2) return 'Worker'
    else if(role==3) return 'Doctor'
    else return 'Patient'
  }

  return (
    <Container>
      <Avatar src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png" />
      <Details>
        <Name>{user.fname} {user.lname}</Name>
        <article>
          <span className="capitalize">{roleEnum[role]}</span>
          <span className={`w-3 h-3 mx-2 inline-block rounded-md ${user.isVerified?"bg-green-500":"bg-red-500"}`}></span>
        </article>
        <Data>
          <InternalData>
            <LocalPhoneIcon /> {user.mobileNo}
          </InternalData>
          <InternalData>
            <MailIcon />
            {user.email}
          </InternalData>
        </Data>
        <PatientDetails>
          <Text>
            <span style={{ color: "#aaaaaa", fontWeight: "600" }}>GENDER </span>{" "}
            <span>{user.gender=='F'?"Female":"Male"}</span>
          </Text>
          <Text>
            <span style={{ color: "#aaaaaa", fontWeight: "600" }}>AGE </span>{" "}
            <span>{calculateAge(user.DoB?Number(user.DoB):2024)}</span>
          </Text>
          <Text>
            <span style={{ color: "#aaaaaa", fontWeight: "600" }}>HEIGHT </span>{" "}
            <span>{user.height?Number(user.height):'180cm'}</span>
          </Text>
          <Text>
            <span style={{ color: "#aaaaaa", fontWeight: "600" }}>WEIGHT </span>{" "}
            <span>{user.weight?Number(user.weight):'82kg'}</span>
          </Text>
          <Text className="flex flex-col gap-2">
            <span className="flex items-center gap-2" style={{ color: "#aaaaaa", fontWeight: "600" }}>
              Date of Birth
            </span>
            <span>
            {user.DoB?`${getDoB(user.DoB)}`:'--/--/--'}
            </span>
          </Text>
        </PatientDetails>
      </Details>
      {
        role==3&&(
          <Doctor>

          <DoctorDetails>
            
              <>
              
              <span
                style={{ color: "#aaaaaa", fontWeight: "500", fontSize: "15px" }}
              >
                {user.designation}
              </span>
              <article>
                {user&&user?.degree.map(ele=>(
                  <span className="bg-blue-200 mx-2 brder-blue-600 rounded-md px-[2px] py-[1px] text-sm text-blue-700">{ele}</span>
                ))}
              </article>
              </>
            
          </DoctorDetails>
          </Doctor>
        )
      }
    </Container>
  );
};

export default ProfileDetails;
