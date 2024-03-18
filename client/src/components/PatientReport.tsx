import React from 'react'
import styled from 'styled-components'
import ReportDetails from '../components/ReportDetails'
import FinalVerdict from '../components/FinalVerdict'

const Container=styled.div`
    height:200px;
    width:200px;
    background-color:#edfafa;
    border-radius:10px;
`
const Title=styled.h3`
    text-align:center;
    margin:10px 5px;
`
const Pdf=styled.img`
    height:100px;
    width:180px;
    margin:2px 10px;
`
const Details=styled.div`
    text-align:center;
    margin-top:8px;
    font-size:14px;
`

const PatientReport = ({disease, date}) => {
  return (
    <Container>
        <Title>{disease}</Title>
        <Pdf src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT61gIUAngwFJizfmbzBN8SqfEQxI1sLCq9Yg&usqp=CAU'></Pdf>
        <Details>Updated on {date}</Details>
    </Container>
  )
}

export default PatientReport;