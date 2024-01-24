import { Link, useLocation } from "react-router-dom"

export const Header:React.FC = ()=>{
    const location = useLocation()
    return(
        <section className="w-full p-1 m-0 bg-red-200 shadow-lg pb-2 border-b-2 border-red-400 h-20" id="header-wrapper">
            <div className="max-w-[1200px] m-auto h-full px-10 flex items-center justify-between">
                <span className="" id="logo">Report</span>
                <ul className="flex max-w-[500px] w-full justify-evenly">
                    {[{to:"/",name:"Home"},{to:"/facility",name:"facility"},{to:"/doctor",name:"Doctor"},{to:"/reports",name:"Report"}].map((ele,index)=>(
                        <li key={index} className={`hover:scale-105 duration-200 ${location.pathname===ele.to?"after:content-[''] after:absolute after:-bottom-1 relative after:w-5 after:left-0 after:h-[3px] after:bg-red-800 after:rounded-md text-red-600":""}`}>
                            <Link to={ele.to}>
                                <span className={`font-medium text-lg text-slate-900 uppercase tracking-wide hover:text-red-600 duration-300 ${location.pathname===ele.to?"text-red-600":""}`}>{ele.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <article className="profile-pic flex items-center gap-2">
                    <img src="login.png" className="w-10 h-10 rounded-full border-1 border-black hover:border-red-600 duration-300"/>
                </article>
            </div>
        </section>
    )
}