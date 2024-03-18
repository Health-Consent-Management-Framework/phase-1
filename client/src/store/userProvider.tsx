import { createContext, useContext, useState } from "react";

type User = {
    email:string,
    password:string,
    username:string,
    type:string,
}

interface UserContextInterface{
    user:User|undefined,
    updateUser:(ele:User)=>void,
    token:string,
    updateToken:(e:string)=>void
}


const UserContext = createContext<UserContextInterface|null>(null)

export const UserProvier:React.FC<{children:React.ReactNode}> = (props)=>{
    const [user,setUser] = useState<User>()
    const [token,setToken] = useState(()=>{
        const userToken = localStorage.getItem("access_token")
        return userToken ? userToken:""
    })

    function updateUser(e){
        setUser(e)
    }

    function updateToken(e:string){
        setToken(e)
        localStorage.setItem("access_token",JSON.stringify(e))
    }

    return(
        <UserContext.Provider value={{user,updateUser,token,updateToken}}>
            {props.children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext) as UserContextInterface