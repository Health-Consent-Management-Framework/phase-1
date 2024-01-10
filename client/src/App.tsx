import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import {Login,Signup,Home,DashBoard,Facilities} from './components'
import './index.css'


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route element={<Home/>} path='/'/>
          <Route element={<Login/>} path='/login'/>
          <Route element={<Signup/>} path='/signup'/>
          <Route element={<DashBoard/>} path='/patient'/>
          <Route element={<Facilities/>} path='/facilities'/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
