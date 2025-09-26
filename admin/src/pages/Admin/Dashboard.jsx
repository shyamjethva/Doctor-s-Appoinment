import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../Context/AdminContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../Context/AppContext'

const Dashboard = () => {

    const { atoken, getDashData, CancelAppointment, dashData } = useContext(AdminContext)

    const { slotDataFormate } = useContext(AppContext)

    useEffect(() => {
        if (atoken) {
            getDashData()
        }
    }, [atoken])
    return dashData && (

        <div className='m-5 '>

            <div className='flex flex-wrap gap-4'>


                <div className='flex item-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.doctor_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
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
                        dashData.latestappointment.map((item, index) => (
                            <div className='flex items-center px-6 py-3 gap-3' key={index}>
                                <img className='w-10 rounded-full cursor-pointer' src={item.doctorData.image} alt="" />
                                <div className='flex-1 text-sm'>
                                    <p className='text-gray-800 font-medium'>{item.doctorData.name}</p>
                                    <p className='text-gray-800'>{slotDataFormate(item.slotDate)}</p>
                                </div>
                                {
                                    item.cancelled
                                        ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                                        : <img onClick={() => CancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                                }
                            </div>
                        ))
                    }

                </div>
            </div>


        </div>
    )
}

export default Dashboard
