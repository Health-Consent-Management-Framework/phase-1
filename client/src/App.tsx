import { BrowserRouter as Router,Routes,Route, Navigate, useLocation } from 'react-router-dom'
import {Login,Signup,Home,DashBoard,Facilities, AddFacility} from './components'
import { Header } from './components/ui'
import './index.css'
import { useWalletContext } from './store/walletProvider'
import { useUserContext } from './store/userProvider'

function App() {
  const {token} = useUserContext()
  const location = useLocation()
  return (
      <div className="App">
        {!["/login","/signup"].includes(location.pathname)&&<Header/>}
        <Routes>
          <Route element={token?<Home/>:<Navigate to={'/login'}/>} path='/'/>
          <Route element={token?<Navigate to={"/"}/>:<Login/>} path='/login'/>
          <Route element={<Signup/>} path='/signup'/>
          <Route element={<DashBoard/>} path='/patient'/>
          <Route element={<Facilities/>} path='/facility'/>
          <Route element={<AddFacility/>} path='/facility/add'/>
        </Routes>
      </div>
  )
}

export default App
