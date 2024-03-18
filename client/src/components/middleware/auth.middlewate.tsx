import { useEffect } from "react"
import { Outlet,useNavigate } from "react-router-dom"

const AuthMiddleware = ()=>{
    const navigate = useNavigate()
    useEffect(()=>{
        if(localStorage.getItem('access_token')&&localStorage.getItem('role')){
            navigate('/home')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return(
        <Outlet/>
    )
}

export default AuthMiddleware