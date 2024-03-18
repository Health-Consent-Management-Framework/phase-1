import {Routes,Route, Navigate, useLocation } from 'react-router-dom'
import {Login,Signup,PageNotFound,Home,Facilities,Reports,AddFacility,AddAdmin, AddWorker, VerifyEmail, AddPatient, AddReport} from './components';
import PatientPage from './components/PatientPage';
import { Header } from './components/ui'
import './index.css'
import { useUserContext } from './store/userProvider'

function App() {
  const {token} = useUserContext()
  const location = useLocation()
  return (
      <div className="App">
        {/* {!["/login","/signup","/forgot","/reset","/verify"].includes(location.pathname)&&<Header/>} */}
        <Routes>
          <Route element={token?<Home/>:<Navigate to={'/login'}/>} path='/'/>
          {/* <Route element={token?<Navigate to={"/"}/>:<Login/>} path='/login'/> */}
          <Route element={<Login/>} path='/login'/>
          <Route element={<Signup/>} path='/signup'/>
          <Route element={<PatientPage/>} path='/patient' />
          <Route element={<DoctorPage/>} path='/doctor' />
          <Route element={<Facilities/>} path='/facility'/>
          <Route element={<AddFacility/>} path='/facility/add'/>
          <Route element={<AddWorker/>} path='/worker/add'/>
          <Route element={<AddPatient/>} path='/patient/add'/>
          <Route element={<AddReport/>} path="/report/add"/>
          <Route element={<AddAdmin/>} path='/admin/add'/>
          <Route element={<VerifyEmail/>} path='/verify'/>
          <Route element={<Reports/>} path='/reports'/>
          <Route element={<PageNotFound/>} path='*'/>
        </Routes>
      </div>
  )
}

export default App
