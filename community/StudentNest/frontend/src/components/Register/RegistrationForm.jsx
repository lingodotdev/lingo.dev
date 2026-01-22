import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'

function RegistrationForm() {


  const [firstname, setfirstname] = useState('')
  const [lastname, setlastname] = useState('')
  const [email, setemail] = useState('')
  const [pass, setPassword] = useState('')
  const navigate = useNavigate()

  const registerUser = async (firstname, lastname, email, pass) => {
    try {
      const response = await axios.post('https://studentnestbackend.onrender.com/register', {
        firstname, lastname, email, pass
      });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const RegistrationHandler = async (e) => {
    e.preventDefault();
    try {
      const controller = await registerUser(firstname, lastname, email, pass);
      if (controller) {
        navigate('/');
      } else {
        alert('Error Occurred');
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Check the Credentials";
      alert(msg);
      console.log(err);
    }
  };



  return (
    <div className='h-screen flex justify-center items-center absolute inset-0 bg-cover z-0 bg-white '>

      <form onSubmit={RegistrationHandler} className=' w-[30vw] h-[80vh] flex flex-col justify-center items-center bg-amber-50 rounded-3xl shadow-2xs gap-10 overflow-hidden'>
        <h1 className='text-3xl text-orange-400 font-bold'>Register</h1>
        <input value={firstname} onChange={(e) => { setfirstname(e.target.value) }} type="text" placeholder='First' className='border-1 outline-none p-2 bg-amber-50 rounded-lg flex-col w-[80%]' />
        <input value={lastname} onChange={(e) => { setlastname(e.target.value) }} type="text" placeholder='Last' className='border-1 outline-none p-2 bg-amber-50 rounded-lg flex-col w-[80%]' />
        <input value={email} onChange={(e) => { setemail(e.target.value) }} type="text" placeholder='E-mail' className='border-1 outline-none p-2 bg-amber-50 rounded-lg flex-col w-[80%]' />
        <input value={pass} onChange={(e) => { setPassword(e.target.value) }} type="text" placeholder='Password' className='border-1 outline-none p-2 bg-amber-50 rounded-lg flex-col w-[80%]' />
        {/* <input value={Conformpassword} onChange={(e) => { setConformPassword(e.target.value) }} type="text" placeholder='Conform Password' className='p-2 bg-amber-50 rounded-lg flex-col w-[80%]' /> */}
        <button type='submit' className='bg-blue-600 text-white pr-8 pl-8 pt-2 pb-2 rounded-3xl hover:bg-red-500'>Submit</button>
      </form>
    </div>
  )
}

export default RegistrationForm
