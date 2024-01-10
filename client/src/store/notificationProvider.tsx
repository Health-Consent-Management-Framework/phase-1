import { createContext, useContext, useEffect, useState } from "react";

interface Notification{
    type:"success"|"error"|"warning",
    message:string
}

interface NotificationContextProps{
    notification:Notification,
    updateNotification:(e:Notification)=>void
}

const NotificationContext = createContext<NotificationContextProps|null>(null)

export const NotifcationProvider:React.FC<{children:React.ReactNode}> = ({children}) => {
    const [notification,setNotification] = useState<Notification>({type:"success",message:"This is an Alert"})
    const [shownNotification,setShowNotification] = useState<boolean>(false)
    const updateNotification = ({type,message}:Notification)=>{
        setShowNotification(true)
        setNotification({type,message})
    }

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setShowNotification(false)  
        },1000) 
        return ()=> clearTimeout(timer)
    },[shownNotification])

    function closeInvitation(){
        setShowNotification(false)
        setNotification({message:"",type:"success"})
    }

    return(
        <NotificationContext.Provider value={{notification,updateNotification}}>
            <div className={`inline-block duration-300 absolute ${shownNotification?`translate-y-[40px]`:`translate-y-[0px]`} -top-[40px] -translate-x-1/2 left-1/2`}>
                <article className="border-[1px] relative rounded-lg font-regular px-2 py-0 pr-6 w-[200px] bg-white shadow-lg">
                    <p>{notification?.message}</p>
                    <button onClick={()=>{closeInvitation()}} className="absolute border-[1px] h-fit duration-300 rounded-2xl px-1 inline-block right-0 hover:border-red-500 top-1/2 -translate-y-1/2">
                        <i className="fa-solid fa-times fa-sm"></i>
                    </button>
                </article>
            </div>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotificationContext = () => useContext(NotificationContext) as NotificationContextProps