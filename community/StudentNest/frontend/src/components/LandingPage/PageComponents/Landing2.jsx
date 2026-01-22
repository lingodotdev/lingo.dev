import React from 'react'
import Footer from '../../Footer/Footer'

function Landing2() {
    return (
        <div className=' grid gap-6 relative top-[50rem]'>
            <h1 className='rotate-270 absolute top-[15rem] left-[-100px] font-semibold text-gray-500 text-5xl'>Our <span className='text-orange-500 font-extrabold'>Services</span></h1>
            <div className='flex justify-center flex-row gap-6 text-gray-700 text-2xl relative'>
                <div className="h-[300px] w-[400px] rounded-2xl shadow-xl/20 bg-orange-300 text-black font-sans transition-transform duration-500 ease-in-out hover:rotate-[6deg] text-3xl flex justify-center items-center">
                    Realtime Support 
                </div>
                <div  className="h-[300px] w-[400px] rounded-2xl shadow-xl/20 bg-gray-200 text-black font-sans transition-transform duration-500 ease-in-out hover:rotate-[6deg] text-3xl flex justify-center items-center">
                    Exclusive Discounts
                </div>
                <div className="h-[300px] w-[400px] rounded-2xl shadow-xl/20 bg-orange-300 text-black font-sans transition-transform duration-500 ease-in-out hover:rotate-[6deg] text-3xl flex justify-center items-center">
                    Support by Community
                </div>
              
            </div>
            <div className='flex justify-center flex-row gap-6 text-gray-700 text-2xl relative'>
                <div className="h-[200px] w-[300px] rounded-2xl shadow-xl/20 bg-gray-300 text-black font-sans transition-transform duration-500 ease-in-out hover:rotate-[6deg] text-3xl flex justify-center items-center">
                    Authorized Flats
                </div>
                <div className="h-[200px] w-[300px] rounded-2xl shadow-xl/20 bg-orange-200 text-black font-sans transition-transform duration-500 ease-in-out hover:rotate-[6deg] text-3xl flex justify-center items-center">
                    Pre-Schedule Service
                </div>
                <div className="h-[200px] w-[300px] rounded-2xl shadow-xl/20 bg-gray-300 text-black font-sans transition-transform duration-500 ease-in-out hover:rotate-[6deg] text-3xl flex justify-evenly items-center">
                    Money Assurance
                </div>
              
            </div>
            <div>
                <Footer/>
            </div>
        </div>)
}

export default Landing2
