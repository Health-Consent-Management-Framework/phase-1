import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import { useRef } from 'react';
import { useCombinedContext } from '../../store';
import { IconButton } from '@mui/material';





const ReportCard = ({disease,reportId,verified,updateMenuOpen, link,tags}) => {
    return (
    <div className='h-[250px] w-[250px] relative flex flex-col border-2 border-[#a8f7f7] bg-[#edfafa] rounded-2xl hover:shadow-lg duration-300 shadow-sm'>
        <div className='flex items-center justify-between py-1 pt-2'>
            <article className='grow flex items-center justify-center'>
            <h1 className='capitalize text-lg'>{disease}</h1>
            {!verified&&(
                <span className='w-2 h-2 mx-2 inline-block rounded-md bg-yellow-600'></span>
            )}
            </article>
            <div className='relative px-2'>
                <IconButton className='' onClick={(e)=>{updateMenuOpen(e.currentTarget,reportId,verified)}}>
                    <MoreVertIcon/>
                </IconButton>
                
            </div>
        </div>
        <div className='p-2 grow h-px'>
            <img className='w-full h-full object-cover object-top' src={link} alt={disease}/>    
        </div>
        <article className='w-full flex items-center gap-2 justify-center pb-5'>
            {tags.map((ele,index)=>(    
                <span key={index} className='text-sm border-2 shadow-sm border-blue-600 px-2 py-[2px] rounded-xl'>{ele}</span>
            ))}
        </article>
    </div>
  )
}

export default ReportCard;