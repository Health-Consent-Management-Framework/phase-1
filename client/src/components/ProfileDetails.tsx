/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from "styled-components";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MailIcon from "@mui/icons-material/Mail";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useEffect } from "react";
import { useCombinedContext } from "../store";

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

  useEffect(()=>{
    console.log(user)
  },[user])

  function calculateAge(year){
    const givenYear = Number(year)
    const curr_year = new Date()
    console.log(curr_year.getFullYear(),year)
    return curr_year.getFullYear() - givenYear;
  }

  return (
    <Container>
      <Avatar src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png" />
      <Details>
        <Name>{user.fname} {user.lname}</Name>
        <Data>
          <InternalData>
            <LocalPhoneIcon /> {user.mobileNo}
          </InternalData>
          <InternalData>
            <MailIcon />
            {user.email}
          </InternalData>
          <InternalData>
            <CalendarMonthIcon />
            {user.DoB?`${Number(user.DoB[2])}-${Number(user.DoB[1])}-${Number(user.DoB[0])}`:'--/--/--'}
            {/* {user.date}-{user.month}-{user.year} */}
          </InternalData>
        </Data>
        <PatientDetails>
          <Text>
            <span style={{ color: "#aaaaaa", fontWeight: "600" }}>GENDER </span>{" "}
            <span>{user.gender=='F'?"Female":"Male"}</span>
          </Text>
          <Text>
            <span style={{ color: "#aaaaaa", fontWeight: "600" }}>AGE </span>{" "}
            <span>{calculateAge(user.DoB?user.DoB[0]:2024)}</span>
          </Text>
          <Text>
            <span style={{ color: "#aaaaaa", fontWeight: "600" }}>HEIGHT </span>{" "}
            <span>{user.height||'180cm'}</span>
          </Text>
          <Text>
            <span style={{ color: "#aaaaaa", fontWeight: "600" }}>WEIGHT </span>{" "}
            <span>{user.weight||'82kg'}</span>
          </Text>
          {/* <button className="hover:border-blue-700 hover:text-blue-700" onClick={handleClick}>Delete</button> */}
        </PatientDetails>
      </Details>
      {
        role==3&&(
          <Doctor>
          <Avatar
            style={{ height: "50px", width: "50px" }}
            src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
          />
          <DoctorDetails>
            {user.length&&(
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
            )}
          </DoctorDetails>
          </Doctor>
        )
      }
    </Container>
  );
};

export default ProfileDetails;
