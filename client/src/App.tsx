import {RouterProvider } from 'react-router-dom'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ThemeProvider } from "@mui/material";
import './index.css'
import theme from './lib/materal.lib';
import router from './router';

const queryClient = new QueryClient()

function App() {
  return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}></RouterProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </div>
  )
}

export default App
