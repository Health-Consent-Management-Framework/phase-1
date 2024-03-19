import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import SideNav from "../SideNav"
import Patient from "../Patient"
import styled from "styled-components";
import { AddReport } from "..";
import { Dialog,DialogContent } from "@mui/material";


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

    useEffect(()=>{
        if(localStorage.getItem('access_token')){
            const role = localStorage.getItem('role');
            if(!role) navigate('/auth')
        }else navigate('/auth')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    function handleReportPopUpClose(index:number){
        setQueryParams()
    }
      
    return(
        <section className="h-screen flex">
            <SideNav/>
            <Container>
                <Patient/>
                <Hr />
                <Wrapper>
                    <Outlet/>
                </Wrapper>
            </Container>
        </section>
    )
}

export default HomeMiddleware

