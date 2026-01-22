import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { RegisterFormValues } from '../../types';
import { useForm, SubmitHandler } from "react-hook-form";
import { register_user } from '../../services';




export default function Register() {
    const [loader, setLoader] = useState(false)
    const navigate =  useNavigate()


    const { register, formState: { errors }, handleSubmit } = useForm<RegisterFormValues>({
        criteriaMode: "all"
    });

    const onSubmit: SubmitHandler<RegisterFormValues> = async data => {
        setLoader(true)

        const res = await register_user(data);
        if (res?.success) {
            toast.success(res?.message)
            setLoader(false)
            setTimeout(() => {
                navigate('/')
            }, 700);
        } else {
            setLoader(false)
            toast.error(res?.message)
        }
    }


    return (
        <section className=" bg-gradient-to-bl from-gray-700 via-gray-900 to-black dark:bg-gray-900  w-full h-screen ">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-full lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Register  your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                                <input {...register("name", { required: true })} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john Doe" />
                                {errors.name && <span className='text-red-500 text-xs mt-2'>This field is required</span>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input {...register("email", { required: true })} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                                {errors.email && <span className='text-red-500 text-xs mt-2'>This field is required</span>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input {...register("password", { required: true })} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                {errors.password && <span className='text-red-500 text-xs mt-2'>This field is required</span>}
                            </div>
                            <div>
                                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input {...register("phone", { required: true })} type="text" name="phone" id="phone" placeholder="+61183102381023" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                {errors.phone && <span className='text-red-500 text-xs mt-2'>This field is required</span>}
                            </div>
                            {
                                loader ? <button className=" w-full btn btn-neutral text-white  font-medium rounded-lg text-sm px-5 py-2.5 text-center "> <span className="loading loading-spinner"></span> Creating Account ! </button> : <button type="submit" className="w-full btn btn-neutral text-white  font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign Up</button>
                            }

                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <Link to="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </section>
    )
}
