import { Outlet,useNavigate } from "react-router-dom"
import { useHandleLogin } from "../../hooks/useHandleLogin"
import { useAuthenticate } from "../../hooks/useAuthenticats"

const AuthMiddleware = ()=>{
    // const navigate = useNavigate()
    
    // const {authenticate} = useAuthenticate();

    return(
        <Outlet/>
    )
}

export default AuthMiddleware