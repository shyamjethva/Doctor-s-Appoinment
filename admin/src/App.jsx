import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import Navbar from './Components/Navbar';
import { AdminContext } from './Context/AdminContext';
import Sidebar from './Components/Sidebar'
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointment from './pages/Admin/AllAppointment';
import AddDoctor from './pages/Admin/AddDoctor';
import Doctors from './pages/Admin/Doctors';
import { DoctorContext } from './Context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import DoctorProfile from './pages/Doctor/DoctorProfile';


const App = () => {

  const { atoken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return atoken || dToken ? (
    <div className='bg-[#F8F9FD]'>

      <ToastContainer />
      {/* <Login /> */}
      <Navbar />

      <div className='flex items-start'>

        <Sidebar />
        <Routes>

          {/* Admin Routes */}
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointment />} />
          <Route path='/add-doctors' element={<AddDoctor />} />
          {/* doctor list  */}
          <Route path='/doctors-list' element={<Doctors />} />


          {/* Doctorc Route */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-Appointments' element={<DoctorAppointment />} />
          <Route path='/doctor-Profile' element={<DoctorProfile />} />

        </Routes>

      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App
