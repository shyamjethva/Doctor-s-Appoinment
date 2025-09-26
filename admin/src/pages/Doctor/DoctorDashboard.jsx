import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../Context/DoctorContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../Context/AppContext'

const DoctorDashboard = () => {

    const { dToken, dashData, setDashData, DoctorDashboard, CompleteAppointment, CancelAppointment } = useContext(DoctorContext)
    const { currency, slotDataFormate } = useContext(AppContext)

    useEffect(() => {
        if (dToken) {
            DoctorDashboard()
        }

    }, [dToken])


    return dashData && (
        <div className='m-5'>
            <div className='flex flex-wrap gap-4'>


                <div className='flex item-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.earning_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{currency}{dashData.earning}</p>
                        <p className='text-gray-400'>Doctors</p>
                    </div>
                </div>


                <div className='flex item-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.appointments_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
                        <p className='text-gray-400'>Appointments</p>
                    </div>
                </div>


                <div className='flex item-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.patients_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
                        <p className='text-gray-400'>patients</p>
                    </div>
                </div>
            </div>

            <div className='bg-white'>
                <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t boder'>
                    <img src={assets.list_icon} alt="" />
                    <p className='font-semibold'>Latest Booking</p>
                </div>

                <div className=' pt-4 border-t-0'>
                    {
                        dashData.latestAppointment?.map((item, index) => (
                            <div key={index} className='flex items-center px-6 py-3 gap-3'>
                                <img className='w-10 rounded-full cursor-pointer' src={item.userData.image} alt="" />
                                <div className='flex-1 text-sm'>
                                    <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                                    <p className='text-gray-800'>{slotDataFormate(item.slotDate)}</p>
                                </div>
                                {
                                    item.cancelled
                                        ? <p className='text-red-500 text-sm font-medium'>Cancelled</p>
                                        : item.isCompleted
                                            ? <p className='text-green-500 text-sm font-medium'>Completed</p>
                                            : <div className='flex'>
                                                <img onClick={() => CancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                                                <img onClick={() => CompleteAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                                            </div>
                                }
                            </div>
                        ))

                    }

                </div>
            </div>
        </div>
    )
}

export default DoctorDashboard
