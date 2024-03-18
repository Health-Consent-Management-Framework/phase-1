import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
const HomeMiddleware = ()=>{
    const navigate = useNavigate()

    useEffect(()=>{
        if(localStorage.getItem('access_token')){
            const role = localStorage.getItem('role');
            if(!role) navigate('/auth')
        }else navigate('/auth')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return(
        <Outlet></Outlet>
    )
}

export default HomeMiddleware

