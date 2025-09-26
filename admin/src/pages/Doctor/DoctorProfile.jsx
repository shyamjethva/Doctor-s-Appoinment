import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../Context/DoctorContext'
import { AppContext } from '../../Context/AppContext'
import { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, doctorprofile, backendUrl } = useContext(DoctorContext)
    const { currency } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)


    const UpdateProfile = async () => {
        try {
            const updateData = {
                docId: profileData._id,
                address: profileData.address,
                fees: profileData.fees,
                available: profileData.available,
            };

            const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, {
                headers: {
                    Authorization: `Bearer ${dToken}`
                }
            });

            if (data.success) {
                toast.success(data.message);
                setIsEdit(false);
                doctorprofile();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    }


    useEffect(() => {
        if (dToken) {
            doctorprofile()
        }
    }, [dToken])


    return profileData && (
        <div>
            <div className='flex flex-col gap-4 m-5'>
                <div>
                    <img className='  bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
                </div>

                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

                    {/* doctor info : name,degree,experience */}

                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
                </div>

                <div className='flex items-center gap-2 mt-1 text-gray-500'>
                    <p className='text-gray-800'>{profileData.degree} - {profileData.speciality}</p>
                    <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
                </div>

                {/* doctor about  */}

                <p className='flex items-center gap-1 font-medium text-sm text-neutral-800'>About</p>
                <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{profileData.about}</p>
            </div>
            <p className='text-gray-800 font-medium mt-4'>
                Appointment Fee: <span className='text-gray-500'>{currency} {isEdit ? <input type='number' onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} /> : profileData.fees}</span>
            </p>

            <div className='flex gap-2 py-2'>
                <p>Address</p>
                <p className='text-sm'>{isEdit ? <input type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={(profileData.address.line1)} /> : profileData.address.line1} <br /> {isEdit ? <input type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={(profileData.address.line2)} /> : profileData.address.line2}</p>
            </div>

            <div className='flex gap-1 pt-2'>
                <input onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} type="checkbox" name='' id='' />
                <label htmlFor="">Available</label>
            </div>

            {
                isEdit
                    ? <button onClick={UpdateProfile} className='px-4 p-2 w-[15vh] border border-primary rounded-full text-md mt-5 hover:bg-primary hover:text-white transition-all'>save</button>

                    : <button onClick={() => setIsEdit(true)} className='px-4 p-2 w-[15vh] border border-primary rounded-full text-md mt-5 hover:bg-primary hover:text-white transition-all'>Edit</button>
            }




        </div>
    )
}

export default DoctorProfile
