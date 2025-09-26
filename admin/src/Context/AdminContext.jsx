import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [atoken, setAtoken] = useState(localStorage.getItem('atoken') ? localStorage.getItem('atoken') : '')
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL


    // for get all doctors
    const getAllDoctors = async () => {

        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/all-doctors`, {}, {
                headers: {
                    Authorization: `Bearer ${atoken}`,
                },
            });

            if (data.success) {

                setDoctors(data.doctors)
                console.log("Doctor data", data.doctors);
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error);
        }
    }

    //for change availability
    const changeAvailablity = async (doctorId) => {

        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { doctorId }, {
                headers: {
                    Authorization: `Bearer ${atoken}`,
                },
            });

            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }
    // for get all appointment
    const getAllAppointments = async () => {

        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
                headers: {
                    Authorization: `Bearer ${atoken}`,
                },
            });

            if (data.success) {
                setAppointments(data.appointments);
                console.log(data.appointments);
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // for cancel appointment
    const CancelAppointment = async (appointmentId) => {
        try {
            console.log("Sending Appointment ID:", appointmentId); // Debug

            const { data } = await axios.post(
                `${backendUrl}/api/admin/cancel-appointment`,
                { appointmentId },
                {
                    headers: {
                        Authorization: `Bearer ${atoken}`,
                    },
                }
            );

            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Cancel Appointment Error:", error);
            toast.error("Failed to cancel appointment");
        }
    };

    // for get dashboard data
    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
                headers: {
                    Authorization: `Bearer ${atoken}`,
                },
            });

            if (data.success) {
                setDashData(data.DashData)
                console.log(data.DashData)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        atoken, setAtoken,
        backendUrl,
        doctors, getAllDoctors,
        changeAvailablity,
        appointments, setAppointments, getAllAppointments,
        CancelAppointment,
        dashData, getDashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}


export default AdminContextProvider