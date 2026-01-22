import { useDispatch, useSelector } from 'react-redux'
import { groupData } from '../../types';
import { setAllGroups, setChatSelected, setGroupSelected } from '../../slices/chatSlice';
import React from 'react';
import { RootState } from '../../store/store';
import { MdDelete } from 'react-icons/md';
import { delete_group } from '../../services';
import { toast } from 'react-toastify';

export interface GroupConversationCardProps {
    group: groupData;
    
}


export default function GroupConversationCard({ group   }: GroupConversationCardProps ) {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.User.user);
    const typingOn = useSelector((state: any) => state.Chat.typing)
    const theme = useSelector((state: RootState) => state.User.themeLight)
    const TyperID = useSelector((state: any) => state.Chat.typerID)
    const token = useSelector((state: RootState) => state.User.token)
    const [typing, setTyping] = React.useState(false)
    const userID = user?._id || "";

    const handleClick = () => {
        dispatch(setChatSelected('group'))

        dispatch(setGroupSelected(group))
    }


    React.useEffect(() => {
        if (typingOn && TyperID?.senderId === group._id) {
            setTyping(true)
        } else {
            setTyping(false)
        }
    }, [typingOn, TyperID])


    const handleDeleteGroup = async () => {
        const res = await delete_group(userID, group._id, token)
        if (res?.success) {
            toast.success(res?.message)
            dispatch(setChatSelected(false))
            dispatch(setGroupSelected({}))
            dispatch(setAllGroups(res?.data))
        } else {
            toast.error(res?.message)
        }
    }

    return (
        <div onClick={handleClick} className={`w-11/12 relative h-20  ${theme === 'on' ? 'bg-white  hover:bg-gray-300 text-black' : "bg-slate-800   hover:bg-slate-950 text-white"}  my-2 flex items-center cursor-pointer rounded-2xl px-4 mx-4 justify-start  transition-all duration-700`}>
            <div className="avatar mx-4 placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                    <span className="text-xs">{group?.name?.substring(0, 2)}</span>
                </div>
            </div>

            <h1 className='font-semibold tracking-widest '>{group?.name}</h1>
            {
                typing && <p className={`text-xs absolute bottom-2 left-20 ${theme === 'on' ? 'text-black' : 'text-white'}  tracking-widest font-semibold`}>Typing...</p>
            }
            <div onClick={handleDeleteGroup} className={` z-50  w-20 absolute h-full flex items-center justify-center  text-red-500 text-xl right-5`}>
                <MdDelete />
            </div>

        </div>
    )
}
