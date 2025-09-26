import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

export const MyProfile = () => {

    const { userdata, setUserData, token, backendUrl, loadUserData } = useContext(AppContext)

    const [isEdit, setisEdit] = useState(false)
    const [image, setImage] = useState(null)

    const formatDate = (isoDate) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const updateUserProfileId = async (req, res) => {

        try {
            const formdata = new FormData()

            formdata.append('name', userdata.name)
            formdata.append('phone', userdata.phone)
            formdata.append("address", JSON.stringify(userdata.address));
            formdata.append('gender', userdata.gender)
            formdata.append('dob', userdata.dob)

            image && formdata.append('image', image)

            const { data } = await axios.post(`${backendUrl}/api/user/updateUser`, formdata, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data"
                }
            });



            if (data.success) {
                toast.success(data.message)
                await loadUserData()
                setisEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }

    }
    return userdata && (
        <div className='max-w-lg flex flex-col gap-2 text-sm'>
            {
                isEdit
                    ? <label htmlFor="image">
                        <div className='inline-block relative cursor-pointer'>
                            <img className='w-36 rounded opacity-100' src={image ? URL.createObjectURL(image) : userdata.image} alt="" />
                            <img className='w-10 absolute bottom-12 right-12' src={assets.upload_area} alt="" />
                        </div>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                    </label> : <img className='w-36 rounded' src={userdata.image} alt="" />

            }
            {
                isEdit
                    ? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" value={userdata.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
                    : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userdata.name}</p>
            }

            <hr className='bg-zinc-400 h-[1px] border-none' />
            <div>
                <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'> Email id:</p>
                    <p className='text-blue-500 cursor-pointer'>{userdata.email}</p>

                    <p className='font-medium'>Phone:</p>
                    {
                        isEdit
                            ? <input className='bg-gray-100 max-w-52' type="text" value={userdata.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
                            : <p className='text-blue-400'>{userdata.phone}</p>
                    }
                    <p className='font-medium'>Address:</p>

                    {
                        isEdit
                            ? <p>
                                <input className='bg-gray-100' onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userdata.address.line1} type="text" />
                                <br />
                                <input className='bg-gray-100' onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userdata.address.line2} type="text" />
                            </p>

                            : <p className='text-gray-500'>
                                {userdata.address.line1}
                                <br />
                                {userdata.address.line2}
                            </p>
                    }
                </div>
                <br />
                <div>
                    <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
                    <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                        <p className='font-medium'>Gender:</p>
                        {
                            isEdit
                                ? <select className='max-w-20 bg-gray-100' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userdata.gender}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                : <p className='text-gray-400'>{userdata.gender}</p>
                        }
                        <p className='font-medium'>BirthDay</p>
                        {
                            isEdit
                                ? <input style={{ width: "100px" }}
                                    className='bg-gray-100'
                                    type="date"
                                    value={
                                        userdata.dob && !isNaN(new Date(userdata.dob).getTime())
                                            ? new Date(userdata.dob).toISOString().split("T")[0]
                                            : ""
                                    }
                                    onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                />
                                : <p className='text-gray-400'>{formatDate(userdata.dob)}</p>

                        }
                    </div>
                </div>
                <div className='mt-10'>
                    {
                        isEdit
                            ? <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary text-black hover:text-white transition-all  duration-400' onClick={updateUserProfileId}>Save Information</button>
                            : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary text-black hover:text-white transition-all duration-400' onClick={() => setisEdit(true)}>Edit</button>
                    }

                </div>
            </div>

        </div>
    )
}

export default MyProfile
