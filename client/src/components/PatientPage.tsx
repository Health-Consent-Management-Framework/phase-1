import Patient from "../components/Patient";
import styled from "styled-components";
import PatientReport from "../components/PatientReport";
import SideNav from "./SideNav";
import { SlLogout } from "react-icons/sl";
import { MdFolderDelete } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";

const Container = styled.div`
  background-color: #faf7f5;
  height: 100vh;
  padding: 10px 30px;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Hr = styled.hr`
  margin: 12px 0px;
  border: 0.5px solid #aaaaaa;
`;

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

const PatientPage = () => {
  return (
    <div className="flex">
      <SideNav data={sideContent} />
      <div className="w-[80%]">
        <Container>
          <Patient />
          <Hr />
          <Wrapper>
            <PatientReport />
            <PatientReport />
            <PatientReport />
          </Wrapper>
        </Container>
      </div>
    </div>
  );
};

export default PatientPage;
