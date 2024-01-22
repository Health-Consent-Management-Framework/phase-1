import { Link } from "react-router-dom"

export const Header:React.FC = ()=>{
    return(
        <section className="w-full p-1 m-0 bg-blue-500 h-20" id="header-wrapper">
            <div className="max-w-[1200px] m-auto h-full px-10 flex items-center justify-between">
                <span className="" id="logo">Report</span>
                <ul className="flex max-w-[500px] w-full justify-evenly">
                    <li>
                        <Link to={"/"}>
                            <span className="font-medium text-lg text-slate-900 uppercase tracking-wide hover:text-blue-200 duration-300">Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/facilites"}>
                            <span className="font-medium text-lg text-slate-900 uppercase tracking-wide hover:text-blue-200 duration-300">Facility</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/doctors"}>
                            <span className="font-medium text-lg text-slate-900 uppercase tracking-wide hover:text-blue-200 duration-300">Doctor</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/news"}>
                            <span className="font-medium text-lg text-slate-900 uppercase tracking-wide hover:text-blue-200 duration-300">News</span>
                        </Link>
                    </li>
                </ul>
                <article className="profile-pic flex items-center gap-2">
                    <img src="login.png" className="w-10 h-10 rounded-full border-1 border-black hover:border-red-600 duration-300"/>
                </article>
            </div>
        </section>
    )
}