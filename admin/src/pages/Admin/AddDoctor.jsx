import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../Context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

export const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [speciality, setSpeciality] = useState('General Physician')
    const [about, setAbout] = useState('')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const { backendUrl, atoken } = useContext(AdminContext)


    const onSubmitHandler = async (e) => {
        e.preventDefault()


        try {

            if (!docImg) {
                return toast.error('Please Select the Image')
            }

            const formData = new FormData()

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('about', about)
            formData.append('address[line1]', address1);
            formData.append('address[line2]', address2);

            formData.forEach((value, key) => {
                console.log(`${key} : ${value}`)
            })

            const { data } = await axios.post(`${backendUrl}/api/admin/add-doctors`, formData, {

                headers: {
                    Authorization: `Bearer ${atoken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("doctor added", data);

            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setEmail('')
                setPassword('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log("Add Doctor Error:", error.response?.data || error.message);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Doctor</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4-4xl max-h-[80vh] overflow-y-scroll '>
                <div className='flex items-center gap-5 mb-8 text-gray-500'>

                    <label htmlFor="doc-img">
                        <img className='w-20 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="doc-img" />
                    </label>

                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id='doc-img' hidden />
                    <p>Upload Doctor <br /> Picture</p>
                </div> <br />

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    <div className='w-full lg:w-1/2 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <p>Doctor Name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded w-4/5 px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded w-4/5 px-3 py-2' type="email" placeholder='Email' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Doctor Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded w-4/5 px-3 py-2' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Doctor Experience</p>
                            <select onChange={(e) => setExperience(e.target.value)} value={experience} className='w-4/5 border rounded px-3 py-2' name="experience" id="">
                                <option value="select">Select Yor Experience</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Doctor Fees</p>
                            <input onChange={(e) => setFees(e.target.value)} value={fees} className='border rounded w-4/5 px-3 py-2' type="Number" placeholder='Fees' required />
                        </div>
                    </div> <br />

                    <div className='w-full lg:w-1/2 flex flex-col gap-4' style={{ marginLeft: '-15vh' }}>
                        <div className='flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} name="Speciality" className='w-4/5 border rounded px-3 py-2'>
                                <option value="speciality" >Select Your Speciality</option>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Education</p>
                            <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border rounded w-4/5 px-3 py-2' type="text" placeholder='Education' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded w-4/5 px-3 py-2' type="text" placeholder='Address 1' required />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded w-4/5 px-3 py-2' type="text" placeholder='Address 2' required />
                        </div>

                        <div className='flex flex-col w-4/5 gap-1'>
                            <p>About Doctor</p>
                            <textarea onChange={(e) => setAbout(e.target.value)} value={about} name="about doctor" placeholder='Write about Doctor' rows={5} className='border rounded px-4 py-1'></textarea>
                        </div>
                    </div>
                </div>

                <div className='mt-6'>
                    <button className='bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-700'>
                        Add Doctor
                    </button>
                </div>

            </div>
        </form >
    )
}

export default AddDoctor
