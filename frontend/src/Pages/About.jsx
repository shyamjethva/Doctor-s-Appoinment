import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
    return (
        <div>
            <div className='text-center text-2xl pt-10 text-grey-500 '>
                <p>ABOUT <span className='text-grey-700 font-medium'>US</span></p>
            </div>

            <div className='my-10 flex flex-col md:flex-row gap-12'>
                <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-grey-600'>
                    <p>Welcome to prescripto, your trusted partner in managing your healthcare needs conveniently and efficciently. At prescripto, we understand the challenge individual face when it comes To Scheduling Doctor Appointment And Managing their health records. </p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic eos, qui labore recusandae obcaecati eaque aut reprehenderit architecto numquam odio maxime, nemo cum dignissimos quisquam ut. Sed reiciendis officiis nemo!</p>
                    <b className='text-grey-800'>Our Vision</b>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit fugit harum aspernatur eveniet accusantium rerum explicabo nostrum esse accusamus nemo architecto, excepturi, reiciendis perferendis veniam corrupti nam similique fuga quos?</p>
                </div>
            </div>
            <div className='text-xl my-4'>
                <p>WHY <span className='text-grey-700 font-semibold'>CHOOSE US </span></p>
            </div>

            <div className='flex flex-col md:flex-row mb:20'>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[-15px] hover:bg-primary hover:text-white transition-all duration-300 text-grey-600 cursor-pointer'>
                    <b>Efficiency:</b>
                    <p>Streamlind appointment scheduling that fits into your busy lifestyle.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[-15px] hover:bg-primary hover:text-white transition-all duration-300 text-grey-600 cursor-pointer'>
                    <b>Convenience:</b>
                    <p>Access to a network trusted healthcare professionals in your area.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[-15px] hover:bg-primary hover:text-white transition-all duration-300 text-grey-600 cursor-pointer'>
                    <b>Personalazation:</b>
                    <p>Tailord recommondations and reminders to help you stay on top of your health.</p>
                </div>
            </div>
        </div>
    )
}

export default About
