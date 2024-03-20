import styled from 'styled-components'
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import { useEffect, useRef } from 'react';

const Container=styled.div`
    height:215px;
    width:200px;
    position:relative;
    background-color:#edfafa;
    border-radius:10px;
`
const Title=styled.h3`
    text-align:center;
    flex-grow:1;
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

const ReportCard = ({disease,reportId,verified,date,viewRequests,expand, updateExpand, link, index,tags,requestVerification,deleteReport,viewReport}) => {
    const popUpRef = useRef<HTMLDivElement>(null)

    return (
    <Container>
            <div className='flex items-center justify-between'>
                <Title>
                    {disease}
                    {!verified&&(
                        <span className='w-2 h-2 mx-2 inline-block rounded-md bg-yellow-600'></span>
                    )}
                </Title>
                <div className='relative px-2'>
                    <button className='' onClick={()=>{updateExpand(index)}}>
                        <MoreVertIcon/>
                    </button>
                    <article ref={popUpRef} className={`absolute flex gap-1 z-10 w-32 ${expand?"h-fit":"h-0"} overflow-hidden flex-col bg-blue-300 rounded-md shadow-sm`}>
                        <a href={link} target='_blank' className='w-full inline-block'>
                            <button className='text-sm duration-300 hover:bg-blue-600 w-full rounded-md p-1 text-white'>
                                View Report
                            </button>
                        </a>
                        {!verified&&<button 
                                        onClick={()=>requestVerification(reportId)}
                                        className='text-sm duration-300 hover:bg-blue-600 rounded-md p-1 text-white'>
                            Request Verification    
                        </button>}
                        <button onClick={()=>viewRequests(reportId)} className='text-sm duration-300 hover:bg-blue-600 w-full rounded-md p-1 text-white'>
                            View Requests
                        </button>
                        {localStorage.getItem('role')=='2'&&<button className='text-sm duration-300 hover:bg-blue-600 rounded-md p-1 text-white'>Edit Report</button>}
                        <button className='text-sm duration-300 hover:bg-blue-600 rounded-md p-1 text-white'>Delete Report</button>
                    </article>
                </div>
            </div>
            <Pdf src={link}></Pdf>
            <Details>Updated on {date}</Details>
            <article className='w-full flex items-center gap-2 justify-center pb-5'>
                {tags.map((ele,index)=>(    
                    <span key={index} className='text-sm border-2 shadow-sm border-blue-600 px-2 py-[2px] rounded-xl'>{ele}</span>
                ))}
            </article>
    </Container>
  )
}

export default ReportCard;