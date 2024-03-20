// import { MdSpaceDashboard } from "react-icons/md";
import { useEffect, useState } from "react";
import roleEnum from "../utils/enums";
import { routeConfig } from "../../router";
import { SlMenu } from "react-icons/sl";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Button } from ".";
import { useNavigate, useSearchParams } from "react-router-dom";

const SideNav = () => {
  const [isOpen, setisOpen] = useState(false);
  const navigate = useNavigate();
  const [role,setRole] = useState(()=>localStorage.getItem('role'))
  const [,setQueryParams] = useSearchParams()
  const [profileExpand,setProfileExpand] = useState(false)
  const [expand,setExpand] = useState(false)
  interface menuElement{
    name:string,
    onClick:(props:any)=>void
  }
  

  const togglefunction = () => {
    setisOpen(!isOpen);
  }

  const menuConfig = {
    patient:[
      {img:'/reportIcon.png',name:'Reports',onClick:()=>navigate(routeConfig.reports)},
      {icon:<NoteAddIcon/>,name:'Add Report',onClick:()=>{
        navigate('/home/reports')
        setQueryParams({mode:'add',type:'report'})
      }},
      {img:'/doctorIcon.png',name:'View Doctors',onClick:()=>navigate(routeConfig.doctors)},
      {img:'/facilityIcon.png',name:'View Facilites', onClick:()=>navigate(routeConfig.facility)},
      {img:'/viewRequests.png',name:'View Requests',onClick:()=>navigate(routeConfig.viewRequests)},
    ],
    doctor:[
      {img:'/reportIcon.png',name:'Reports',onClick:()=>navigate(routeConfig.reports)},
      {icon:<NoteAddIcon/>,name:'Add Report',onClick:()=>{setQueryParams({mode:'add',type:'report'})}},
      {icon:<NoteAddIcon/>,name:'Patient Report',onClick:()=>{navigate(routeConfig.reports);setQueryParams({type:'report',mode:'patient'})}},
      {img:'/doctorIcon.png',name:'View Doctors',onClick:()=>navigate(routeConfig.doctors)},
      {img:'/facilityIcon.png',name:'View Facilites', onClick:()=>navigate(routeConfig.facility)},
      {img:'/viewRequests.png',name:'View Requests',onClick:()=>navigate(routeConfig.viewRequests)},
    ],
    worker:[
      {img:'/reportIcon.png',name:'My Reports',onClick:()=>navigate(routeConfig.reports)},
      {icon:<NoteAddIcon/>,name:'Add Report',onClick:()=>{setQueryParams({mode:'add',type:'report'})}},
      {icon:<NoteAddIcon/>,name:'Upload Request',onClick:()=>{navigate(routeConfig.reports);setQueryParams({type:'report',mode:'patient'})}},
      {img:'/doctorIcon.png',name:'View Doctors',onClick:()=>navigate(routeConfig.doctors)},
      {img:'/facilityIcon.png',name:'View Facilites', onClick:()=>navigate(routeConfig.facility)},
      {img:'/viewRequests.png',name:'View Requests',onClick:()=>navigate(routeConfig.viewRequests)},
    ],
    admin:[
      {name:'My reports',onClick:()=>navigate(routeConfig.reports)},
      {name:'Add Report',onClick:()=>navigate(routeConfig.reports)},
      {name:'Add Facility',onClick:()=>navigate(routeConfig.viewRequests)},
      {name:'Add Patient',onClick:()=>navigate(routeConfig.viewRequests)},
      {name:'Add Worker',onClick:()=>navigate(routeConfig.viewRequests)},
      {name:'Upload Request',onClick:()=>navigate(routeConfig.reports)},
      {name:'Admin Request',onClick:()=>navigate(routeConfig.reports)},
      {name:'Worker Requests',onClick:()=>navigate(routeConfig.doctors)},
    ],
  } 

  const handleLogout = ()=>{
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    navigate(routeConfig.login)
  }


  return (
    <>
      <div className="bg-slate-50 border-2 h-screen border-slate-400 pt-10 w-[300px] px-10 text-left  flex flex-col min-h-screen">
        <div>
          <Button className="text-xl font-medium bg-[#4864d6] text-white">
            Start new Chat
          </Button>
        </div>
        <div className="py-5 grow">
          {
            role&&menuConfig[roleEnum[role]].map((ele)=>(
              <article key={ele.name} className="my-4">
                <button onClick={ele.onClick} className="flex gap-2 text-[18px]">
                  {ele.icon&&ele.icon}
                  {ele.img&&<img className="w-6 h-6" src={ele.img}/>}
                  {ele.name}
                </button>
              </article>
            ))
          }
        </div>
        <div className="relative" id="profile-section">
            <article className="py-8">
              <button onClick={handleLogout} className="flex gap-2 text-[18px]">
                <img src="/user.png" className="w-5 h-5"/>
                Log Out
              </button>
            </article>
            <article className={`bottom-10 bg-white ${profileExpand?'h-24':'h-0'} duration-300 overflow-hidden w-full left-10 absolute rounded-md shadow-md`}>
              <button className="py-3 w-full duration-300 hover:text-white font-medium rounded-md mt-1 text-black text-center hover:bg-[#4864d697]">Delete Account</button>
              <button className="py-3 w-full duration-300 hover:text-white font-medium rounded-md mt-1 text-black text-center hover:bg-[#4864d697]">Log Out</button>
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