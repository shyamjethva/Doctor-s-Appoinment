import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/* ----------- Left Section --------------- */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-grey-600 leading-6'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam ullam odio inventore similique quis illum in, doloribus architecto, maxime porro velit exercitationem excepturi accusamus aliquam nulla sequi dignissimos dolore nam.</p>
                </div>

                {/* ------------ Center Section---------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>Comapny</p>
                    <ul className='flex flex-col cursor-pointer gap-2 text-black'>
                        <li to='/'>Home</li>
                        <li to='/about'>About</li>
                        <li>Contact us</li>
                        <li>Private policy</li>
                    </ul>
                </div>

                {/* -------- Right Section --------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>Get In Touch</p>
                    <ul className='flex flex-col gap-2 text-black'>
                        <li>+91-123-123-1234</li>
                        <li>sj@gmail.com</li>
                    </ul>
                </div>
            </div>

            {/* --------- Copy Right Text --------- */}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2025@ Shyam Jethva -All Rights Reserved.</p>
            </div>
        </div>
    )
}

export default Footer
