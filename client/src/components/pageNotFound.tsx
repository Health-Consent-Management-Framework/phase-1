import { Link } from "react-router-dom"
import { Button } from "./ui"

export const PageNotFound:React.FC = ()=>{
    return(
        <section className="flex items-center pt-[30vh] justify-center">
            <div className="bg-slate-200 border-slate-400 shadow-md rounded-xl p-3">
                <p className="text-2xl font-medium">Oops! Page Not Found</p>
                <div className="flex justify-center items-center">
                    <Link to={'/'} >
                       <Button className="bg-red-500 hover:bg-red-200 mt-3">Home</Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}