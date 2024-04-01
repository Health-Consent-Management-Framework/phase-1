import avatar from '../../assets/avatar.png'
import { MoreVert } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const DoctorCard:React.FC = (props)=>{
    return(
        <div className="w-full relative max-w-[600px] m-auto flex shadow-lg border-2 rounded-md flex-col items-center">
            <div className="w-full p-3 flex justify-between items-center gap-5">
                <article>
                    <img className='w-16 h-16' src={avatar} alt="" />
                </article>
                <article className='grow'>
                    <article className='flex gap-1'>
                        <span><strong className='font-medium text-[#34343]'>Name:</strong> {props.fname}</span>
                        <span>{props.lname}</span>
                    </article>
                    <p><span className='font-medium text-[#343434]'>Email: </span>{props.email}</p>
                    {/* <p><span className='font-medium text-[#343434]'>Mobile: </span>{props.mobileNo}</p> */}
                    {/* <p className='w-full text-ellipsis text-sm'><span className='font-medium text-[#343434] text-[16px]'>Address: </span>{props.walletAddress}</p> */}
                </article>
                <article>
                    <IconButton onClick={(e)=>{props.updateMenu(e.currentTarget,props.walletAddress)}} sx={{border:"1px solid #a4a4a4"}}>
                        <MoreVert/>
                    </IconButton>
                </article>
            </div>
            <article className='w-full flex items-center gap-2 justify-center border-t-2 border-blue-500 p-2'>
                <span className=''>{props.designation}</span>
                {props.degree.map(ele=>(
                <span key={ele} className='bg-blue-400 rounded-md font-medium text-blue-600 px-2 py-1 text-sm'>{ele}</span>
                ))}
            </article>
        </div>
    )
}

export default DoctorCard;