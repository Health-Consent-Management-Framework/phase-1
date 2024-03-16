import Patient from '../components/Patient'
import styled from 'styled-components'
import PatientReport from '../components/PatientReport'


const Container = styled.div`
    background-color:#f7d988;
    height:100vh;
    padding:10px 30px;
    border-radius:20px;
`
const Wrapper =styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
`
const Hr = styled.hr`
    margin:12px 0px;
    border:0.5px solid #aaaaaa;
`
const PatientPage = () => {
  return (
    <Container>
        <Patient />
        <Hr/>
        <Wrapper>
          <PatientReport />
          <PatientReport />
          <PatientReport />
        </Wrapper>
    </Container>
  )
}

export default PatientPage;
