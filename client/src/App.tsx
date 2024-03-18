import {RouterProvider } from 'react-router-dom'
// import { Header } from './components/ui'
import './index.css'
import router from './router';

function App() {
  return (
      <div className="App">
        <RouterProvider router={router}></RouterProvider>
        {/* {!["/login","/signup","/forgot","/reset","/verify"].includes(location.pathname)&&<Header/>} */}
        {/* <Routes>
          <Route element={token?<Navigate to={"/"}/>:<Login/>} path='/login'/> 
          <Route element={token?<Home/>:<Navigate to={'/login'}/>} path='/'/>
          <Route element={<Login/>} path='/login'/>
          <Route element={<Signup/>} path='/signup'/>
          <Route element={<PatientPage/>} path='/patient' />
          <Route element={<DoctorPage/>} path='/doctor' />
          <Route element={<Facilities/>} path='/facility'/>
          <Route element={<AddFacility/>} path='/facility/add'/>
          <Route element={<AddDoctor/>} path='/doctor/add'/>
          <Route element={<AddDoctorPatient/>} path='/doctor/addpatient'/>
          <Route element={<AddWorker/>} path='/worker/add'/>
          <Route element={<AddPatient/>} path='/patient/add'/>
          <Route element={<AddReport/>} path="/report/add"/>
          <Route element={<AddAdmin/>} path='/admin/add'/>
          <Route element={<VerifyEmail/>} path='/verify'/>
          <Route element={<Reports/>} path='/reports'/>
          <Route element={<PageNotFound/>} path='*'/>
        </Routes> */}
      </div>
  )
}

export default App
