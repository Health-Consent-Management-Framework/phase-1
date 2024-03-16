import React from 'react'
import styled from 'styled-components'

const Container=styled.div`
    margin:10px;
`
const Color=styled.div`
    width:68px;
    height:10px;
`
const Wrapper=styled.div`
    display:flex;
    justify-content:center;
    gap:2px;
`
const Result=styled.div`
    padding:5px 15px;
    background-color:yellow;
    border:1px solid;
    border-radius:5px;
    font-weight:500;
    margin-top:10px;
    display:flex;
    align-items:center;
    gap:5px;
    justify-content:center;
`
const FinalVerdict = ({result}) => {
  return (
    <Container>
        <Wrapper>
            <Color style={{backgroundColor:'green'}}/>
            <Color style={{backgroundColor:'blue'}}/>
            <Color style={{backgroundColor:'orange'}}/>
            <Color style={{backgroundColor:'red'}}/>
        </Wrapper>
        <Result>{result}</Result>
    </Container>
  )
}

export default FinalVerdict
