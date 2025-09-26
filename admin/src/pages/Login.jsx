import React, { useContext, useState } from 'react'
import { AdminContext } from '../Context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../Context/DoctorContext'


const Login = () => {

  const navigate = useNavigate()
  const [state, setState] = useState("Admin")
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setAtoken, backendUrl } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)

  const onSubmitHandler = async (event) => {

    event.preventDefault()

    try {

      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {

          localStorage.setItem('token', data.token)

          console.log("token saved", data.token);
          setAtoken(data.token)
          toast.success("Login Succesfull");
          // console.log(data.token);
        }
        else {
          toast.error("Login Failed")
        }
      }
      else {
        const { data } = await axios.post(backendUrl + '/api/doctor/doclogin', { email, password })
        if (data.success) {

          localStorage.setItem('DToken', data.token)

          console.log("DToken saved", data.token);
          setDToken(data.token)
          toast.success("Login Succesfull");
          navigate('/doctor-dashboard');

        }
        else {
          toast.error("Login Failed")
        }
      }

    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Invalid email or password");
    }
  }

  const handleReset = async () => {
    // try {
    //   const { data } = await axios.post(backendUrl + '/api/admin/reset-paasword', { email, password })

    //   if (data.success) {
    //     alert('Password updated successfully!');
    //   } else {
    //     alert(data.message || 'Error updating password');
    //   }
    // } catch (err) {
    //   console.error(err);
    //   alert('Server error');
    // }


    try {

      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/reset-paasword', { email, password })
        if (data.success) {

          localStorage.setItem('token', data.token)

          console.log("token saved", data.token);
          setAtoken(data.token)
          toast.success("Login Succesfull");
          // console.log(data.token);
        }
        else {
          toast.error("Login Failed")
        }
      }
      else {
        const { data } = await axios.post(backendUrl + '/api/doctor/reset-paasword', { email, password })
        if (data.success) {

          localStorage.setItem('DToken', data.token)

          console.log("DToken saved", data.token);
          setDToken(data.token)
          toast.success("Login Succesfull");
          navigate('/doctor-dashboard');

        }
        else {
          toast.error("Login Failed")
        }
      }

    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Invalid email or password");
    }
  }


  return (
    <div>
      <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
          <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state} &nbsp;</span>Login</p>
          <div className='w-full'>
            <p>Email</p>
            <input className='border border-[#DADADA] rounded w-full p-2 mt-2' type="email" required onChange={(e) => setEmail(e.target.value)} value={email} />
          </div>
          <div className='w-full'>
            <p>Password</p>
            <input className='border border-[#DADADA] rounded w-full p-2 mt-2' type="password" required onChange={(e) => setPassword(e.target.value)} value={password} />
          </div>
          <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
          {state === 'Admin'
            ? <p>Doctor Login? <span className='text-primary cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></p>
            : <p>Admin Login? <span className='text-primary cursor-pointer' onClick={() => setState('Admin')}>Click here</span></p>
          }
        </div>
      </form>
    </div>
  )
}

export default Login

