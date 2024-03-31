import React, { useState } from "react";
import {roleEnum} from "../utils/enums";
import { routeConfig } from "../../router";
import { VscRequestChanges } from "react-icons/vsc";
import {Dashboard, DocumentScanner,LocationCity,Info,Person,Link} from '@mui/icons-material';
import { CgWebsite } from "react-icons/cg";
import { FaUserDoctor } from "react-icons/fa6";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useNavigate, useSearchParams } from "react-router-dom";
import {useCombinedContext} from "../../store"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface propType{
  requestVerification:()=>void,
  deleteAccount:()=>void,
}

const SideNav:React.FC<propType> = (props) => {
  const [navExapnd, setNavExpand] = useState<boolean>(true);
  const navigate = useNavigate();
  const {user,role,updateUser,updateRole} = useCombinedContext();
  const [,setQueryParams] = useSearchParams()
  const [profileExpand,setProfileExpand] = useState(false)


  const menuConfig = {
    patient:[
      {icon:<Dashboard/>,name:"Home",onClick:()=>navigate(routeConfig.home)},
      {icon:<DocumentScanner/>,name:'Reports',onClick:()=>navigate(routeConfig.reports)},
      {icon:<FaUserDoctor/>,name:'View Doctors',onClick:()=>navigate(routeConfig.doctors)},
      {icon:<LocationCity/>,name:'View Facilites', onClick:()=>navigate(routeConfig.facility)},
      {icon:<VscRequestChanges/>,name:'View Requests',onClick:()=>navigate(routeConfig.viewRequests)},
      {icon:<Link/>,name:'Connections',onClick:()=>navigate(routeConfig.viewConnections)},
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
      {verification:true,icon:<Info/>,name:'Other Requests',onClick:()=>{
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
    <section className="absolute md:relative z-10 h-full">
      <div className={`bg-teal-200 ${navExapnd?"w-[280px]":"w-[80px]"} duration-300 shadow-md border-2 h-screen text-slate-800 border-blue-200 pt-10 md:min-w-[280px] text-left  flex flex-col min-h-screen`}>
        <article className="w-full mb-4 flex justify-center gap-1 text-blue-600 items-center md:px-8 relative">
          <span>
            <CgWebsite size={30}/>
          </span>
          <span className={`font-medium ${navExapnd?"":"hidden"} md:inline-block text-2xl `}>
              Report Dash
          </span>
          <button onClick={()=>setNavExpand(prev=>!prev)} className={`md:hidden inline-block rounded-lg duration-300 border-[1px] border-black ${navExapnd?"-rotate-90 right-2 ":"rotate-90 -right-5"} absolute top-1/2 -translate-y-1/2`}>
            <KeyboardArrowDownIcon/>
          </button>
        </article>
        <div className={`py-5 ${navExapnd?"px-10":"flex flex-col items-center md:items-stretch"} md:px-10 grow`}>
          {
            role&&menuConfig[roleEnum[role]].map((ele)=>(
              <article key={ele.name} className={`my-3`}>
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
                  <button onClick={ele.onClick} className={`flex font-medium ${ele.verification?user.isVerified?"":"hidden":""} gap-2 ps-2 text-[18px]`}>
                    {ele.icon&&ele.icon}
                    {ele.img&&<img className="w-6 h-6" src={ele.img}/>}
                    <span className={`${navExapnd?"":"hidden"} md:inline-block`}>
                      {ele.name}
                    </span>
                  </button>
                )
                }
              </article>
            ))
          }
        </div>
        <div className="relative px-10" id="profile-section">
            <article className="py-8">
              <button onClick={()=>{setProfileExpand(prev=>!prev)}} className="flex gap-2 text-[18px]">
                <Person/>
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
    </section>
  )
}

export default SideNav