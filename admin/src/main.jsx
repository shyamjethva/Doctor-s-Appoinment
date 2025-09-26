import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './Context/AdminContext.jsx'
import AppContextProvider from './Context/AppContext.jsx'
import DoctorContextProvider from './Context/DoctorContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
      <AppContextProvider>
        <DoctorContextProvider>
          <App />
        </DoctorContextProvider>
      </AppContextProvider>
    </AdminContextProvider>
  </BrowserRouter>


)
