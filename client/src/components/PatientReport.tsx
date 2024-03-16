import styled from 'styled-components'
import ReportDetails from '../components/ReportDetails'
import FinalVerdict from '../components/FinalVerdict'


const Container=styled.div`
    margin:20px 20px;
    width:300px;
    height:350px;
    background-color:#99adff;
    border-radius:10px;
    padding:10px;
`

const Heading=styled.h1`
    font-size:20px;
    text-align: center;
    margin-top:10px;
`

const Hr = styled.hr`
    margin:12px 0px;
    border:0.5px solid #aaaaaa;
`

const Details=styled.div`
    margin-bottom:20px;
    display:flex;
    align-items:center;
    justify-content:space-between;
`
const Image=styled.img`
    height:100px;
    width:110px;
`


const Button = styled.button`
    padding:5px 15px;
    background-color:#3f62f2;
    border:1px solid #3f62f2;
    color:#aaaaaa;
    border-radius:5px;
    font-weight:500;
    display:flex;
    align-items:center;
    gap:5px;
    cursor:pointer;
    justify-content:center;
`
const Wrapper=styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    margin-top:25px;
`

const PatientReport = () => {
  return (
    <Container>
        <Heading>Blood Pressure</Heading>
        <Hr/>
        <Details>
            <Image src="https://cdni.iconscout.com/illustration/premium/thumb/blood-pressure-checkup-5377549-4494360.png?f=webp" />
            <div>
            <ReportDetails key1="Systolic" value="130"></ReportDetails>
            <Hr/>
            <ReportDetails key1="Dialostic" value="90"></ReportDetails>
            </div>
        </Details>
        <FinalVerdict result="LOW RISK"/>
        <Wrapper>
        <Button>Show Details</Button>
        </Wrapper>
    </Container>
  )
}

export default PatientReport
