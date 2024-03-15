/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// import ContactDetails from "./ContactDetails";
import { CiPhone } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";

const Mini_card1 = (props) => {
  return (
    <div className='flex items-center'>
      <span>{props.icon}</span>
      <p className="pl-2">{props.content}</p>
    </div>
  )
}

const Mini_card2 = (props) => {
  return (
    <div>
        <p className='text-[#a3a3a3] font-medium text-[12px]'>{props.title}</p>
        <p className='font-medium'>{props.value}</p>
    </div>
  )
}


const ContactDetails = (props) => {
  return (
    <div>
      <div className='flex justify-between pt-1 pb-1 flex-wrap'>
        <Mini_card1 icon={<CiPhone />} content={props.contact.phone} />
        <Mini_card1 icon={<CiMail />} content={props.contact.mail} />
        <Mini_card1 icon={<SlCalender />} content={props.contact.date} />
      </div>
      {/* <div className='flex justify-between mt-2 flex-wrap'>
        <Mini_card2 title="SURGERY" value={props.details.surgery} />
        <Mini_card2 title="HEIGHT" value={props.details.height} />
        <Mini_card2 title="WEIGHT" value={props.details.weight} />
        <Mini_card2 title="BMI" value={props.details.bmi} />
      </div> */}
    </div>
  )
}


const PatientInfo = (props) => {
  return (
    <div className='w-[95%] md:w-[75%]  ml-auto mr-auto p-4 lg:p-4 flex flex-col lg:flex-row rounded-xl bg-slate-50 shadow-lg justify-evenly my-10'>
      <div className='flex w-[90%]'>
        <div className=''>
          <img src='/tree.jpg' alt='image' className='hidden md:block w-[85px] h-[85px] rounded-full '></img>
        </div>
        <div className='w-[90%] lg:w-[75%] ml-4 lg:ml-10 flex flex-col justify-evenly'>
          <p className='font-medium text-[20px]'>Hello World!</p>
          <ContactDetails contact={props.contact} details={props.details} />
        </div>
      </div>
      <div className='lg:ml-20 flex lg:flex-col justify-between items-center lg:w-[20%]'>
        <p className='p-3 font-medium'>Reports: Yes</p>
        <p className='text-right p-2 font-medium'>View Details</p>
      </div>
    </div>
  )
}

export default PatientInfo