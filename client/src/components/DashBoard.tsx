import { Outlet } from "react-router-dom"
import styled from "styled-components";
import ProfileDetails from "./ProfileDetails"
import SideNav from "./ui/SideNav"

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

export const DashBoard:React.FC = ()=>{
    return(
        <section className="h-screen flex">
            <SideNav/>
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