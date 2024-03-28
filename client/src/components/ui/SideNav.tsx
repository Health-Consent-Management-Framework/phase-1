import React, { useState } from "react";
import {roleEnum} from "../utils/enums";
import { routeConfig } from "../../router";
import InfoIcon from '@mui/icons-material/Info';
import { SlMenu } from "react-icons/sl";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useNavigate, useSearchParams } from "react-router-dom";
import {useCombinedContext} from "../../store"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface propType{
  requestVerification:()=>void,
  deleteAccount:()=>void,
}

const SideNav:React.FC<propType> = (props) => {
  const [isOpen, setisOpen] = useState(false);
  const navigate = useNavigate();
  const {user,role,updateUser,updateRole} = useCombinedContext();
  const [,setQueryParams] = useSearchParams()
  const [profileExpand,setProfileExpand] = useState(false)

  const togglefunction = () => {
    setisOpen(!isOpen);
  }

  const menuConfig = {
    patient:[
      {img:'/reportIcon.png',name:'Reports',onClick:()=>navigate(routeConfig.reports)},
      {img:'/doctorIcon.png',name:'View Doctors',onClick:()=>navigate(routeConfig.doctors)},
      {img:'/facilityIcon.png',name:'View Facilites', onClick:()=>navigate(routeConfig.facility)},
      {img:'/viewRequests.png',name:'View Requests',onClick:()=>navigate(routeConfig.viewRequests)},
    ],
    doctor:[
      {img:'/reportIcon.png',name:'My Reports',onClick:()=>navigate(routeConfig.reports)},
      {verification:true,icon:<NoteAddIcon/>,name:'Other Reports',onClick:()=>{navigate(routeConfig.reports);setQueryParams({type:'report',mode:'patient'})}},
      {img:'/doctorIcon.png',name:'View Doctors',onClick:()=>navigate(routeConfig.doctors)},
      {img:'/facilityIcon.png',name:'View Facilites', onClick:()=>navigate(routeConfig.facility)},
      {img:'/viewRequests.png',name:'View Requests',onClick:()=>navigate(routeConfig.viewRequests)},
    ],
    worker:[
      {img:'/reportIcon.png',name:'My Reports',onClick:()=>navigate(routeConfig.reports)},
      {verification:true,icon:<NoteAddIcon/>,name:'Other Reports',onClick:()=>{navigate(routeConfig.reports);setQueryParams({type:'report',mode:'patient'})}},
      {img:'/doctorIcon.png',name:'View Doctors',onClick:()=>navigate(routeConfig.doctors)},
      {img:'/facilityIcon.png',name:'View Facilites', onClick:()=>navigate(routeConfig.facility)},
      {img:'/me.png',
        name:'My Requests',
        onClick:()=>navigate(routeConfig.viewRequests),
      },
      {verification:true,img:'/viewRequests.png',name:'Others Requests',onClick:()=>{
        navigate(routeConfig.viewRequests)
        setQueryParams({'user':'other'})
      }},
    ],
    admin:[
      {img:'/reportIcon.png',name:'Reports',onClick:()=>navigate(routeConfig.reports)},
      {img:'/facilityIcon.png', name:'Facilites', onClick:()=>navigate(routeConfig.facility)},
      {img:'/doctorIcon.png', name:'Doctors', onClick:()=>navigate(routeConfig.doctors)},
      // {icon:<PersonAddAltIcon/>, name:'Add User',onClick:()=>navigate(routeConfig.addUser)},
      {img:"/me.png",name:'My Requests',onClick:()=>navigate(routeConfig.viewRequests)},
      {verification:true,icon:<InfoIcon/>,name:'Other Requests',onClick:()=>{
        navigate(routeConfig.viewRequests)
        setQueryParams({'user':'other'})
      }},
    ],
  } 

  const handleLogout = ()=>{
    localStorage.clear()
    navigate(routeConfig.login)
    updateUser({})
    updateRole('')
  }


  return (
    <>
      <div className="bg-slate-50 border-2 h-screen border-slate-400 pt-10 min-w-[280px] px-8 text-left  flex flex-col min-h-screen">
        <span className="font-medium text-2xl text-[#4864d6]">
            Report Dash
        </span>
        <div className="py-5 grow">
          {
            role&&menuConfig[roleEnum[role]].map((ele)=>(
              <article key={ele.name} className="my-4">
                {ele.children?(
                  <article className="flex flex-col gap-2">
                    <span className="bg-gray-400 flex  ps-2 gap-2 font-medium mb-2 py-1">
                      {ele.icon&&ele.icon}
                      {ele.img&&<img className="w-6 h-6" src={ele.img}/>}
                      {ele.name}
                    </span>
                    {ele.children.map(child=>(
                      <button onClick={child.onClick} className="flex ps-4 mb-1">
                        {child.icon&&child.icon}
                        {child.img&&<img className="w-6 h-6" src={child.img}/>}
                        {child.name}
                      </button>
                    ))}
                  </article>
                )
                :(
                  <button onClick={ele.onClick} className={`flex ${ele.verification?user.isVerified?"":"hidden":""} gap-2 ps-2 text-[18px]`}>
                    {ele.icon&&ele.icon}
                    {ele.img&&<img className="w-6 h-6" src={ele.img}/>}
                    {ele.name}
                  </button>
                )
                }
              </article>
            ))
          }
        </div>
        <div className="relative" id="profile-section">
            <article className="py-8">
              <button onClick={()=>{setProfileExpand(prev=>!prev)}} className="flex gap-2 text-[18px]">
                <img src="/user.png" className="w-5 h-5"/>
                {user?user.fname+user.lname:""}
                <span className={`duration-300 ${profileExpand?"rotate-180":""}`}>
                  <KeyboardArrowDownIcon/>  
                </span>
              </button>
            </article>
            <article className={` bg-blue-200 ${profileExpand?'h-fit':'h-0'} duration-300 overflow-hidden w-full  z-10 bottom-20 absolute rounded-md shadow-md`}>
              {!user.isVerified&&(
                <button onClick={props.requestVerification} className="py-3 w-full duration-300 hover:text-white font-medium rounded-md mt-1 text-black text-center hover:bg-[#4864d697]">Request Verification</button>
              )}
              {/* <button onClick={props.deleteAccount} className="py-3 w-full duration-300 hover:text-white font-medium rounded-md mt-1 text-black text-center hover:bg-[#4864d697]">Delete Account</button> */}
              <button className="py-3 w-full duration-300 hover:text-white font-medium rounded-md mt-1 text-black text-center hover:bg-[#4864d697]" onClick={handleLogout}>Log Out</button>
            </article>
        </div>
      </div>
      <div className="md:hidden">
        <button onClick={togglefunction}> <SlMenu /> </button>
      </div>
    </>
  )
}

export default SideNav