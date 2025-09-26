import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { toast } from "react-toastify";
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {


    const { token, setToken, backendUrl } = useContext(AppContext)
    const navigate = useNavigate();

    const [state, setState] = useState('Sign Up')


    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const onSubmitHandller = async (event) => {
        event.preventDefault();

        try {
            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password });

                if (data.success) {
                    toast.success("Registered Successfully");
                    setState('Login');
                }
                else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });

                if (data.success) {
                    setToken(data.token);
                    localStorage.setItem('token', data.token);
                    toast.success("Login Successful");

                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token])


    return (

        <form onSubmit={onSubmitHandller} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 rouned-xl text-zinc-600 text-sm shadow-lg'>
                <p className='text-2xl text-black font-semibold'> {state === 'Sign Up' ? "Create Account" : "Login"}</p>
                <p className='text-black'>Please {state === 'Sign Up' ? "Sign Up" : "Login"}  to Book Appointment</p>

                {
                    state === "Sign Up" &&

                    <div className='w-full'>
                        <p className='text-black'> Full Name</p>
                        <input className='border border-white-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} />
                    </div>
                }


                <div className='w-full'>
                    <p className='text-black'>Email</p>
                    <input className='border border-white-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                </div>

                <div className='w-full'>
                    <p className='text-black'>paasword</p>
                    <input className='border border-white-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                </div>

                <button type='submit' className='bg-primary rounded-md text-white w-full py-2 items-center text-base '>{state === 'Sign Up' ? "Create Account" : "Login"}</button>

                {
                    state === "Sign Up"
                        ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary bold cursor-pointer'>Login here</span> </p>
                        : <p>Create an new account? <span onClick={() => setState('Sign Up')} className='text-primary bold cursor-pointer'>click here </span> </p>
                }
            </div>

        </form>

    )
}

export default Login
