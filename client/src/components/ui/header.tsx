import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

export const Header:React.FC = ()=>{
    const location = useLocation()
    const [expand,setExpand] = useState(false)
    const options = (
        <div className="max-w-sm absolute bg-white border-2 z-[1000] p-4 border-gray-300 right-0 top-[120%]">
            <ul className="flex flex-col gap-5 w-full justify-start">
                    {[{to:"/",name:"Home"},{to:"/facility",name:"facility"},{to:"/doctor",name:"Doctor"},{to:"/reports",name:"Report"}].map((ele,index)=>(
                        <li key={index} className={`hover:scale-105 duration-200 ${location.pathname===ele.to?"after:content-[''] after:absolute after:-bottom-1 relative after:w-5 after:left-0 after:h-[3px] after:bg-red-800 after:rounded-md text-red-600":""}`}>
                            <Link to={ele.to}>
                                <span onClick={()=>setExpand(false)} className={`font-medium text-lg text-slate-900 uppercase tracking-wide hover:text-red-600 duration-300 ${location.pathname===ele.to?"text-red-600":""}`}>{ele.name}</span>
                            </Link>
                        </li>
                    ))}
                <li className={`hover:scale-105 duration-200`}>
                    <span className={`font-medium text-lg text-slate-900 uppercase tracking-wide hover:text-red-600 duration-300 break-keep whitespace-nowrap`}>Log Out</span>
                </li>
            </ul>
        </div>
    )
    return(
        <section className="w-full p-1 m-0 bg-red-200 shadow-lg pb-2 border-b-2 border-red-400 h-20" id="header-wrapper">
            <div className="max-w-[1200px] m-auto h-full px-10 flex items-center justify-between">
                <span className="" id="logo">Report</span>
                <ul className="max-w-[500px] hidden md:flex w-full justify-evenly">
                    {[{to:"/",name:"Home"},{to:"/facility",name:"facility"},{to:"/doctor",name:"Doctor"},{to:"/reports",name:"Report"}].map((ele,index)=>(
                        <li key={index} className={`hover:scale-105 duration-200 ${location.pathname===ele.to?"after:content-[''] after:absolute after:-bottom-1 relative after:w-5 after:left-0 after:h-[3px] after:bg-red-800 after:rounded-md text-red-600":""}`}>
                            <Link to={ele.to}>
                                <span className={`font-medium text-lg text-slate-900 uppercase tracking-wide hover:text-red-600 duration-300 ${location.pathname===ele.to?"text-red-600":""}`}>{ele.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <article className="profile-pic relative flex items-center gap-2">
                    <button onClick={()=>{setExpand(prev=>!prev)}} className="flex md:hidden border-2 border-red-700 bg-red-300 p-2">
                        <img className="w-5 h-5" src="hamburger.png"/>
                    </button>
                    <button className="hidden md:flex">
                    <img src="login.png" className="w-10 h-10 rounded-full border-1 border-black hover:border-red-600 duration-300"/>
                    </button>
                    {expand&&options}
                </article>
            </div>
        </section>
    )
}