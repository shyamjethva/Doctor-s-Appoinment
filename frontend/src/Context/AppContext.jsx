import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import { useEffect } from "react";

export const AppContext = createContext()


const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userdata, setUserData] = useState(false)


    const getDoctorsData = async (req, res) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                setDoctors(data.doctors)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }
    //get User in frontend
    const loadUserData = async (req, res) => {
        const token = localStorage.getItem("token");
        console.log("Frontend Token:", token);
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/getUser`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                setUserData(data.user)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const value = {
        doctors, getDoctorsData, currencySymbol, backendUrl,
        token, setToken,
        userdata, setUserData, loadUserData
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserData()
        }
        else {
            setUserData(false)
        }
    }, [token])





    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}


export default AppContextProvider