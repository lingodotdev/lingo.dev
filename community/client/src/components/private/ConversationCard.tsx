import { useDispatch, useSelector } from 'react-redux'
import { setChatSelected, setReceiverSelected } from '../../slices/chatSlice'
import { userData } from '../../types'
import React from 'react';
import { RootState } from '../../store/store';



export interface ConversationCardProps {
    user: userData;
}

export default function ConversationCard({ user }: ConversationCardProps) {
    const dispatch = useDispatch()
    const typingOn = useSelector((state: any) => state.Chat.typing)
    const TyperID = useSelector((state: any) => state.Chat.typerID)
    const theme = useSelector((state: RootState) => state.User.themeLight)
    const loggedInUser = useSelector((state : RootState) => state.User.user)
    const [typing, setTyping] = React.useState(false)
    const handleClick = () => {
        dispatch(setChatSelected('basic'))
        dispatch(setReceiverSelected(user))
    }


    React.useEffect(() => {
        (( TyperID?.senderId === user._id && TyperID?.receiverId !== user?._id && loggedInUser?._id === TyperID?.receiverId && typingOn) )? setTyping(true) : setTyping(false);
    }, [TyperID, typingOn])



    return (
        <div onClick={handleClick} className={`w-11/12 relative h-20  ${theme === 'on' ? 'bg-white  hover:bg-gray-300 text-black' : "bg-slate-800   hover:bg-slate-950 text-white"}  my-2 flex items-center cursor-pointer rounded-2xl px-4 mx-4 justify-start  transition-all duration-700`}>
            <div className={`avatar ${user?.online ?  "online" : ""} mx-4 placeholder`}>
                <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                    <span className="text-xs">{user.name.substring(0, 2)}</span>
                </div>
            </div>

            <h1 className='font-semibold tracking-widest '>{user.name}</h1>
            {
                typing && <p className={`text-xs absolute bottom-2 left-20 ${theme === 'on' ? 'text-black' : 'text-white'}  tracking-widest font-semibold`}>Typing...</p>
            }
        </div>
    )
}
