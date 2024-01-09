import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import {Login,Signup,Home} from './components'
import './index.css'


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route element={<Home/>} path='/'/>
          <Route element={<Login/>} path='/login'/>
          <Route element={<Signup/>} path='/signup'/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
