import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../Context/AdminContext'

const Doctors = () => {
    const { doctors, atoken, getAllDoctors, changeAvailablity } = useContext(AdminContext)

    useEffect(() => {

        if (atoken) {
            getAllDoctors()

        }
    }, [atoken])
    return (
        <div className='m-5 max-h-[90vh] overflow-y-scroll'>
            <h1 className='text-lg font-medium'>All Doctors</h1>
            <div className='w-full flex flex-wrap gap-2 pt-5 gap-y-6'>
                {
                    doctors.map((item, index) => (
                        <div className='border border-indigo-200 rounded-xl max-w-56 cursor-pointer' key={index}>
                            <img className='bg-indigo-50 rounded hover:bg-primary transition-all duration-500' src={item.image} alt="" />
                            <div className='p-4'>
                                <p className='text-neutral-600 text-lg font-medium'>{item.name}</p>
                                <p className='text-neutral-600 text-sm font-medium'>{item.speciality}</p>
                                <div className='mt-2 flex items-center gap-1 text-sm'>
                                    <input className='cursor-pointer' onChange={() => changeAvailablity(item._id)} type="checkbox" checked={item.available} />
                                    <p>Available</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Doctors
