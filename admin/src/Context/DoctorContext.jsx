import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('DToken') ? localStorage.getItem('DToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    const getAppointments = async (req, res) => {

        try {
            console.log("Dtoken", dToken);

            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
                headers: {
                    Authorization: `Bearer ${dToken}`,
                },
            });
            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // API to complete Appointment for doctor
    const CompleteAppointment = async (appointmentId) => {

        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/cancelAppointment`, { appointmentId },
                {
                    headers: {
                        Authorization: `Bearer ${dToken}`,
                    },
                }
            );

            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }


    // API to cancel Appointment for doctor
    const CancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/cancelAppointment`,
                { appointmentId },
                {
                    headers: {
                        Authorization: `Bearer ${dToken}`,
                    },
                }
            );

            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    //API to Doctor Dashboard
    const DoctorDashboard = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/doctor-dashboard`, {
                headers: {
                    Authorization: `Bearer ${dToken}`,
                },
            });

            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);

        }
    }


    //doctor Profile
    const doctorprofile = async (req, res) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/doctor-profile`, {
                headers: {
                    Authorization: `Bearer ${dToken}`,
                },
            });

            if (data.success) {
                setProfileData(data.profileData)
                console.log(data.profileData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);

        }
    }


    const value = {
        backendUrl,
        dToken, setDToken,
        appointments, setAppointments, getAppointments,
        CompleteAppointment,
        CancelAppointment,
        dashData, setDashData, DoctorDashboard,
        profileData, setProfileData, doctorprofile
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )

}


export default DoctorContextProvider