import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../Context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../Context/AppContext'
import { assets } from '../../assets/assets'

const AllAppointment = () => {

    const { atoken, appointments, getAllAppointments, CancelAppointment } = useContext(AdminContext)
    const { calculateAge, slotDataFormate, currency } = useContext(AppContext)

    useEffect(() => {
        if (atoken) {
            getAllAppointments()
        }
    }, [atoken])
    return (

        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'>All Appointments</p>
            <div className='bg-white border rounded  text-sm max-h-[80vh] min-h-[60] overfolw-y-scroll '>
                <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Doctor</p>
                    <p>Fees</p>
                    <p>Actions</p>
                </div>

                {appointments.map((item, index) => (
                    <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 border-b hover:bg-gray-50' key={index} >
                        <p className='max:sm-hidden'>{index + 1}</p>
                        <div className='flex items-center p-2.5 '>
                            <img className='w-9  rounded-full' src={item.userData.image} alt="" /> &nbsp; <p>{item.userData.name}</p>
                        </div>
                        <p>{calculateAge(item.userData.dob)}</p>
                        <p>{slotDataFormate(item.slotDate)}, {item.slotTime}</p>
                        <div className='flex items-center gap-2'>
                            <img className='w-8 rounded-full' src={item.doctorData.image} alt="" />
                            <p>{item.doctorData.name}</p>
                        </div>
                        <p>{currency}{item.amount}</p>
                        {
                            item.cancelled
                                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                                : <img onClick={() => CancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                        }

                    </div>
                ))}

            </div>
        </div>


    )
}

export default AllAppointment
