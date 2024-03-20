import { createContext, useContext,useEffect,useState } from "react";


type User = {
    email:string,
    password:string,
    username:string,
    type:string,
}

interface UserContextInterface{
    user:User|undefined,
    updateUser:(ele:User)=>void,
    role:number,
    updateRole:(ele:number)=>void;
}


const UserContext = createContext<UserContextInterface|null>(null)

export const UserProvier:React.FC<{children:React.ReactNode}> = (props)=>{

    const [user,setUser] = useState<User>()
    const [role,setRole] = useState(()=>localStorage.getItem("role")?JSON.parse(localStorage.getItem("role") as string):'')

    function updateUser(e){
        setUser(e)
    }

    function updateRole(e:number){
        setRole(role)
        localStorage.setItem("role",JSON.stringify(e))
    }

    return(
        <UserContext.Provider value={{user,role,updateUser,updateRole}}>
            {props.children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext) as UserContextInterface