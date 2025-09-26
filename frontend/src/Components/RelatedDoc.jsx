import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoc = ({ speciality, docId }) => {

    const { doctors } = useContext(AppContext)
    const navigate = useNavigate()

    const [relDoc, setRelDoc] = useState([])

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const DoctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)

            setRelDoc(DoctorsData)
        }
    }, [doctors, speciality, docId])
    return (
        <div className='flex flex-col items-center gap-4 my-16 text-grey-900 md:mx-10'>
            <h1 className='text-3xl font-medium'>Related Doctors</h1>

            <p className='sm:w-1/3 text-center text-sm'>Simply Browse through our extensive list of trusted doctors.</p>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-2 py-6'>
                {relDoc.slice(0, 5).map((item, index) => (
                    <div className='border border-blue-200 rounded-xl overflow-hiddden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} key={index}>

                        <img className='flex items-center rounded-xl bg-blue-50' src={item.image} alt="" />
                        <div className='p-4'>
                            <div className='flex  items-center gap-2 text-sm text-center text-green-500'>
                                <p className='w-2 h-2 bg-green-500 rounded-full'></p> <p>Available</p>
                            </div>
                            <p className='text-grey-900 text-lg font-medium'>{item.name}</p>
                            <p className='text-grey-600 text-sm'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-blue-50 text-grey-600 px-12 py-3 rounded-full mt-10'>More</button>
        </div>
    )
}

export default RelatedDoc
