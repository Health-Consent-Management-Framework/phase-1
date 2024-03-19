import {initializeApp} from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { createContext, useContext } from 'react'
      
interface firebaseContext {
    app:any,
    storage:any
}

const FireBaseContext = createContext<firebaseContext>({app:undefined,storage:undefined})

const FireBaseProvider:React.FC<{children:React.ReactNode}> = (props)=>{

    const firebaseConfig = {
        apiKey: "AIzaSyCOYQ19Pmty1WnINrokqNUdmSURJRpLUlk",
        authDomain: "majorproject-d974d.firebaseapp.com",
        projectId: "majorproject-d974d",
        storageBucket: "majorproject-d974d.appspot.com",
        messagingSenderId: "1087188747137",
        appId: "1:1087188747137:web:abd2c9b9c20dcdd3021e80"
      }
      
      const app = initializeApp(firebaseConfig)
      const storage = getStorage(app);

    return(
        <FireBaseContext.Provider value={{app,storage}}>
            {props.children}
        </FireBaseContext.Provider>
    )
}

export {FireBaseProvider}

export const useFirebase = ()=> useContext(FireBaseContext)