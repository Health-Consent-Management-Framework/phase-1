import styled from 'styled-components'

const Container=styled.div`
    height:60px;
    width:150px;
    background-color:#f7d988;
    border-radius:5px;
`
const Key=styled.h2`
    font-size:16px;
    padding:3px 2px;
    display:flex;
    justify-content:center;
`
const Value=styled.h1`
    font-size:24px;
    padding:3px 2px;
    display:flex;
    justify-content:center;
`

const ReportDetails = ({key1, value}) => {
  return (
    <Container>
        <Key>{key1}</Key>
        <Value>{value}</Value>
    </Container>
  )
}

export default ReportDetails
