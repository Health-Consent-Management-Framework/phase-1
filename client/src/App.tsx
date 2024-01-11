import { BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom'
import {Login,Signup,Home,DashBoard,Facilities} from './components'
import './index.css'
import { useWalletContext } from './store/walletProvider'

function App() {
  const {wallet} = useWalletContext()
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route element={wallet&&wallet.accounts?.length?<Home/>:<Navigate to={'/login'}/>} path='/'/>
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
