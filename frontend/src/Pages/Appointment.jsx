import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import { assets, specialityData } from '../assets/assets'
import RelatedDoc from '../Components/RelatedDoc'
import { toast } from 'react-toastify'
import axios from 'axios'

export const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const navigate = useNavigate()

    const [docInfo, setdocInfo] = useState(null)
    const [docSlots, setDocslots] = useState([])
    const [slotIndex, setslotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')

    const fetchDocInfo = async () => {
        const docInfo = doctors.find(doc => doc._id === docId)
        setdocInfo(docInfo)
    }

    const getAvailableSlots = async () => {
        if (!docInfo || !docInfo.slots_booked) {
            console.warn("Doctor info not loaded yet");
            return;
        }
        setDocslots([])

        //getting curent date
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            //getting date with index 
            let currentdate = new Date(today)
            currentdate.setDate(today.getDate() + i)

            //setting and time of the date with index 
            let endtime = new Date()
            endtime.setDate(today.getDate() + i)
            endtime.setHours(21, 0, 0, 0)

            //setting hours
            if (today.getDate() == currentdate.getDate()) {
                currentdate.setHours(currentdate.getHours() > 10 ? currentdate.getHours() + 1 : 10)
                currentdate.setMinutes(currentdate.getMinutes() > 30 ? 30 : 0)
            }
            else {
                currentdate.setHours(10)
                currentdate.setMinutes(0)
            }

            let timeslots = []

            while (currentdate < endtime) {
                let formattedTime = currentdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                let day = currentdate.getDate()
                let month = currentdate.getMonth() + 1
                let year = currentdate.getYear()

                const slotDate = `${day}/${month}/${year}`
                const slotTime = formattedTime

                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

                if (isSlotAvailable) {
                    //add slot to array 
                    timeslots.push({
                        datetime: new Date(currentdate),
                        time: formattedTime
                    })
                }

                //increment current time by 30 minutes
                currentdate.setMinutes(currentdate.getMinutes() + 30)
            }

            setDocslots(prev => ([...prev, timeslots]))
        }
    }

    // Appointment Booking 
    const AppointmentBook = async (req, res) => {

        if (!token) {
            toast.warn("Login To Book Appointment")
            return navigate('/login')
        }

        try {
            const date = docSlots[slotIndex][0].datetime

            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getYear()

            const slotDate = day + "/" + month + "/" + year
            // console.log(slotDate);

            if (!docId || !slotDate || !slotTime) {
                toast.error("Please select doctor, date, and time");
                return;
            }
            const { data } = await axios.post(`${backendUrl}/api/user/appointmentBook`, { docId, slotDate, slotTime }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                toast.success(data.message)
                getDoctorsData()
                navigate('/my-appointments')
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }


    useEffect(() => {
        fetchDocInfo()
    }, [doctors, docId])

    useEffect(() => {
        getAvailableSlots()
    }, [docInfo])

    useEffect(() => {
        console.log(docSlots);
    }, [docSlots])


    return docInfo && (
        <div>
            {/* ---------- Doctors Details ------------ */}
            <div className='flex flex-col sm:flex-row gap-8'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>
                <div className='flex-1 border border-grey-800 rounded-lg p-8 py-7'>
                    {/* -------------  Doc Info : name, degree, experience */}
                    <p className='flex item-center gap-2 text-2xl font-medium text-grey-900'>
                        {docInfo.name} <img className='w-5 ' src={assets.verified_icon} alt="" />
                    </p>
                    <div className='flex item-center gap-2 text-sm mt-1'>
                        <p>
                            {docInfo.degree} - {docInfo.speciality}
                        </p>
                        <button className='py-0.5 px-2 border text-xs rounded-full '>
                            {docInfo.experience}
                        </button>
                    </div>
                    {/* ------- Doctors About -------- */}
                    <div>
                        <p className='flex item-cener gap-1 text-sm font-medium text-grey-900 mt-3'>
                            About <img src={assets.info_icon} alt="" />
                        </p>
                        <p className='text-sm text-grey-500 max-w[700px] mt-1'>
                            {docInfo.about}
                        </p>
                    </div>
                    <p className='text-grey-500 font-medium mt-4'>
                        Appointment Fees: <span className='text-grey-600 '>{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/* -------------- Booking Slot ------------------- */}
            <div className='mt-4 font-medium text-grey-700'>
                <p className="text-center">Booking Slot</p>

                <div className="mt-8 w-full overflow-x-auto">
                    <div className="w-max mx-auto flex gap-4 px-4">
                        {
                            docSlots.map((item, index) => (
                                <div
                                    key={index}
                                    className={`text-center py-4 px-3 rounded-full min-w-[80px] cursor-pointer 
              ${slotIndex === index ? 'bg-blue-500 text-white' : 'border border-gray-300 text-black'}`}
                                    onClick={() => setslotIndex(index)}
                                >
                                    <p className="font-bold">{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                    <p>{item[0] && item[0].datetime.getDate()}</p>
                                </div>
                            ))
                        }
                    </div>

                    <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                        {docSlots.length && docSlots[slotIndex].map((item, index) => (
                            <p
                                key={index}
                                onClick={() => setSlotTime(item.time)}
                                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-blue-500 text-white' : 'text-gray-600 border border-gray-300'}`}
                            >
                                {item.time.toLowerCase()}
                            </p>
                        ))}
                    </div>
                    <button onClick={AppointmentBook} className='bg-primary text-white font-medium text-md font-light mt-8 px-14 py-3  rounded-full'>Book an Apppintmnet</button>
                </div>

                {/* ---------- listing Related Doctors --------- */}

                <RelatedDoc docId={docId} speciality={docInfo.speciality} />
            </div>

        </div >
    )
}

export default Appointment
