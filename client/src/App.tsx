import {RouterProvider } from 'react-router-dom'
import { ThemeProvider } from "@mui/material";
import './index.css'
import theme from './lib/materal.lib';
import router from './router';

function App() {
  return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <RouterProvider router={router}></RouterProvider>
        </ThemeProvider>
      </div>
  )
}

export default App
