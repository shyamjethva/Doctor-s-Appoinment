import React, { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyAppoinments = () => {

    const { token, backendUrl, getDoctorData } = useContext(AppContext)

    const [appointments, setAppointments] = useState([])
    const month = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


    const slotDataFormate = (slotDate) => {
        if (!slotDate) return "";

        const dateArray = slotDate.split('/');
        if (dateArray.length !== 3) return slotDate;

        const day = dateArray[0];
        const monthIndex = Number(dateArray[1]);
        let year = Number(dateArray[2]);

        if (year < 1000) {
            year = 1900 + year;
        }

        return `${day} ${month[monthIndex]} ${year}`;
    };


    const navigate = useNavigate()

    const getUserAppointment = async (req, res) => {

        try {
            const { data } = await axios.get(`${backendUrl}/api/user/UserAppointment`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                toast.success(data.message)
                setAppointments(data.appointments.reverse())
                console.log(data.appointments);
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    //cancle Appointment
    const CancleAppointment = async (appointmentId) => {

        try {
            const token = localStorage.getItem("token");
            console.log("Token", token);
            const { data } = await axios.post(`${backendUrl}/api/user/CancelAppointment`, { appointmentId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                toast.success(data.message)
                getUserAppointment()
                getDoctorData()
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }

    // razorpay payment
    const initpay = (order) => {

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            currency: order.currency,
            name: 'Appointmnt Payment',
            description: 'Appointment Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log(response)

                try {

                    const { data } = await axios.post(`${backendUrl}/api/user/verifyrazorpay`, response, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (data.success) {
                        getUserAppointment()
                        navigate('/my-appointments')

                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                }
            }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()

    }

    // payment
    const appointmentRozarpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/payment`, { appointmentId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                initpay(data.order)
            }

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        if (token) {
            getUserAppointment()
        }
    }, [token])

    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointment</p>
            <div>
                {appointments.map((item, index) => (
                    <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
                        <div>
                            <img className='w-32 bg-indigo-50' src={item.doctorData.image} alt="" />
                        </div>

                        <div className='flex-1 text-sm text-zinc-600'>
                            <p className='text-neutral-800 font-semibold'>{item.doctorData.name}</p>
                            <p>{item.doctorData.speciality}</p>
                            <p className='text-zinc-700 font-medium mt-1'>Adddres:</p>
                            <p className='text-xs'>{item.doctorData.address.line1}</p>
                            <p className='text-xs'>{item.doctorData.address.line2}</p>
                            <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDataFormate(item.slotDate)} | {item.slotTime} </p>
                        </div>



                        <div>
                            <div className='flex flex-col gap-2 justify-end'>
                                {/* If not cancelled & payment done */}
                                {!item.cancelled && item.payment && (
                                    <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 hover:bg-green-600 hover:text-white'>
                                        Appointment Booked
                                    </button>
                                )}

                                {/* If not cancelled & not paid */}
                                {!item.cancelled && !item.payment && (
                                    <>
                                        <button
                                            onClick={() => appointmentRozarpay(item._id)}
                                            className='text-sm text-stone-500 sm:min-w-48 py-2 border hover:bg-primary hover:text-white rounded transition-all duration-300'>
                                            Pay Online
                                        </button>
                                        <button
                                            onClick={() => CancleAppointment(item)}
                                            className='text-sm text-stone-500 sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white rounded transition-all duration-300'>
                                            Cancel Appointment
                                        </button>
                                    </>
                                )}

                                {/* If appointment cancelled */}
                                {item.cancelled && (
                                    <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 hover:bg-red-600 hover:text-white'>
                                        Appointment Cancelled
                                    </button>
                                )}
                            </div>
                        </div>


                    </div>

                ))}

            </div>
        </div>

    )
}

export default MyAppoinments
