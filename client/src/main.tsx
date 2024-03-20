import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {CombinedContextProvider} from './store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CombinedContextProvider>
      <App />
    </CombinedContextProvider>
  </React.StrictMode>,
)
