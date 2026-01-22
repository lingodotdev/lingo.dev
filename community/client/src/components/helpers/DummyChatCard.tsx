
import {FaWhatsapp} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

export default function DummyChatCard() {
  const theme =  useSelector((state : RootState) => state.User.themeLight)
  return (
    <div className={`w-full h-full hidden  ${theme === 'on' ?  'bg-white   text-black' : "bg-slate-800   text-white"}  lg:flex items-center justify-center  flex-col`}>
        <FaWhatsapp className="text-4xl mb-4" />
        <h1 className='text-xl font-semibold tracking-wider'>Web Chat Application</h1>
        <p className='text-xs  my-1'>Explore, chat, connect, and conquer conversations!</p>
        

    </div>
  )
}
