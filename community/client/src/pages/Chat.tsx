import React, { useEffect, useState, useRef, FormEvent, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { useNavigate } from 'react-router-dom'
import { setAllGroups, setAllUserData, setGroupMessages, setMessages, setTyperID, setTyping, setUserMessageLoading } from '../slices/chatSlice';
import { create_group, getChatData, getGroupChatData, get_all_users, get_user_group } from '../services';
import { BiLogOut, BiSearch } from 'react-icons/bi'
import { FaUserGroup } from 'react-icons/fa6'
import { toast, ToastContainer } from 'react-toastify';
import { MdGroupAdd } from 'react-icons/md'
import { PiChatsFill } from 'react-icons/pi'
import Select from "react-select";
import { socket } from '../App';
import { setTheme } from '../slices/userSlice';
import { ChatCard, ConversationCard, DummyChatCard, GroupChatCard, GroupConversationCard, Loading } from '../components';



export default function Chat() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [showConversationBox, setShowConversationBox] = useState('basic')
    const [searchTerm, setSearchTerm] = useState('');
    const [showName, setShowName] = useState(false)
    const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
    const chatSelected = useSelector((state: RootState) => state.Chat.chatSelected)
    const token = useSelector((state: RootState) => state.User.token)
    const userData = useSelector((state: RootState) => state.User.user)
    const receiver = useSelector((state: RootState) => state.Chat.receiverSelected)
    const group = useSelector((state: RootState) => state.Chat.groupSelected);
    const allUsers = useSelector((state: RootState) => state.Chat.allUsers)
    const [createGroup, setCreateGroup] = useState(false)
    const [groupName, setGroupName] = useState('')
    const someoneTyping = useSelector((state: RootState) => state.Chat.someOneTyping);
    const [selectedGroupUsers, setSelectedGroupUsers] = useState<string[]>([]);
    const allGroups = useSelector((state: RootState) => state.Chat.allGroups)
    const loading = useSelector((state: RootState) => state.Chat.userMessageLoading)
    const theme = useSelector((state: RootState) => state.User.themeLight)



    useEffect(() => {
        if (!token || !userData) {
            socket.emit('userOffline', userData?._id)
            navigate('/')
        }
    }, [token, userData])






    useEffect(() => {
        getDataOfAllUsers()
        getDataOfAllGroupsOFThisUser()
    }, [showConversationBox])







    useEffect(() => {
        if (receiver && Object.keys(receiver).length > 0 || group && Object.keys(group).length > 0) {
            getChat();
            getGroupChat()
        } else {
            return;
        }
    }, [receiver, group, userData])


    const getChat = async () => {
        dispatch(setUserMessageLoading(true))
        if (!userData || !receiver) return dispatch(setUserMessageLoading(false));
        const getMessages = { senderId: userData?._id, receiverId: receiver?._id } as unknown as string
        const res = await getChatData(getMessages, token);
        if (res?.success) {
            dispatch(setUserMessageLoading(false))
            dispatch(setMessages(res?.data))
        } else {
            dispatch(setUserMessageLoading(false))
        }
    }

    const getDataOfAllUsers = async () => {
        if (!userData?._id) return
        const res = await get_all_users(userData?._id, token);
        if (res?.success) {
            dispatch(setAllUserData(res?.data))
        } else {
            toast.error(res?.message)
        }
    }

    const getDataOfAllGroupsOFThisUser = async () => {
        if (!userData?._id) return
        const res = await get_user_group(userData?._id, token);
        if (res?.success) {
            dispatch(setAllGroups(res?.data))
        } else {
            toast.error(res?.message)
        }

    }


    const getGroupChat = async () => {
        dispatch(setUserMessageLoading(true));
        const uniqueID = `${group?.users?.map(user => user?._id).join('-')}-${group?.createdBy?._id}`;
        if (!uniqueID) return dispatch(setUserMessageLoading(false));

        if (group) {
            dispatch(setGroupMessages({ groupId: group?._id, messages: [] }));
        }

        const getMessages = {groupId : group?._id,  senderId: userData?._id, receiverId: uniqueID } as unknown as string;
        const res = await getGroupChatData(getMessages, token);
        if (res?.success) {
            dispatch(setGroupMessages({ groupId: group?._id, messages: res?.data }));
            dispatch(setUserMessageLoading(false));
        } else {
            dispatch(setUserMessageLoading(false));
        }
    };


    const useOutsideClick = (callback: () => void) => {
        const ref = useRef<HTMLDivElement>(null);

        React.useEffect(() => {
            const handleClick = (event: MouseEvent) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    callback();
                }
            };

            document.addEventListener('click', handleClick, true);

            return () => {
                document.removeEventListener('click', handleClick, true);
            };
        }, [ref]);

        return ref;
    };

    const handleClickOutside = () => {
        setShowName(false);
        setCreateGroup(false)
    };

    // Detecting if user click on outside of targeted Div then close that div automatically
    const showNameRef = useOutsideClick(handleClickOutside);


    // Throttling the search input to avoid unnecessary API calls
    const throttle = <T extends any[]>(func: (...args: T) => void, delay: number) => {
        let timeoutId: ReturnType<typeof setTimeout>;

        return function (this: any, ...args: T) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const throttledFilter = throttle<string[]>(filterItems, 500);

    function filterItems(searchTerm: string) {
        if (showConversationBox === 'basic') {
            return allUsers?.filter((user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else {
            return allGroups?.filter((group) =>
                group.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    }

    const handleSearchInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
            throttledFilter(e.target.value);
        },
        [throttledFilter]
    );



    const selectUsers: any = allUsers.map((user) => ({ value: user._id, label: user.name }))



    const handleCreateGroup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(setUserMessageLoading(true))
        if (groupName === '' || selectedGroupUsers.length === 0) {
            dispatch(setUserMessageLoading(false))
            toast.error('Please fill all the fields')
            return
        }

        const finalData = { name: groupName, users: selectedGroupUsers, createdBy: userData?._id }

        const res = await create_group(finalData, token);
        if (res?.success) {
            dispatch(setUserMessageLoading(false))
            toast.success(res?.message)
            setCreateGroup(false)
        } else {
            dispatch(setUserMessageLoading(false))
            toast.error(res?.message)
        }


        setShowConversationBox('basic')
    }


    useEffect(() => {
        const handleUserIsTyping = () => {
            if (someoneTyping) {
                socket.emit('userIsTyping', { senderId: userData?._id, receiverId: receiver?._id });
            } else {
                socket.emit('userStopTyping', { senderId: userData?._id, receiverId: receiver?._id });
            }
        };

        const timeoutId = setTimeout(handleUserIsTyping, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [someoneTyping]);




    useEffect(() => {
        const handleUserIsTyping = () => {
            socket.emit('userIsTyping', { senderId: userData?._id, receiverId: receiver?._id });

            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            setTypingTimeout(
                setTimeout(() => {
                    if (socket.on('userIsTyping', (data) => {
                        if (data === null || data === undefined) return socket.emit('userStopTyping', { senderId: userData?._id, receiverId: receiver?._id });;
                    }))
                        socket.emit('userStopTyping', { senderId: userData?._id, receiverId: receiver?._id });
                    setTypingTimeout(null);
                }, 2000)
            );
        };

        if (someoneTyping) {
            handleUserIsTyping();
        } else {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
                setTypingTimeout(null);
            }
        }

        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [someoneTyping, userData, receiver]);




    useEffect(() => {
        const handleTyping = (data: any) => {
            const { senderId, receiverId } = data;
            if (senderId !== receiver?._id) {
                dispatch(setTyping(true))
                dispatch(setTyperID({ senderId, receiverId }))
            }
        };

        socket.on('userIsTyping', handleTyping);



        return () => {
            socket.off('userIsTyping', handleTyping);
        };
    }, [someoneTyping]);


    useEffect(() => {
        const handleUserStopTyping = () => {
            dispatch(setTyping(false))
        };

        socket.on('userStopTyping', handleUserStopTyping);

        return () => {
            socket.off('userStopTyping', handleUserStopTyping);
        };
    }, [someoneTyping]);



    const handleChangeTheme = useCallback(() => {
        if (theme === 'off') {
            dispatch(setTheme('on'));
        } else {
            dispatch(setTheme('off'));
        }
    }, [dispatch, theme]);





    return (
        <div className={`w-full  min-h-screen ${theme === 'on' ? 'bg-gray-50' : "bg-slate-950"} flex items-center justify-center`}>

            <label className={`swap z-50  swap-rotate fixed lg:top-5  right-10 top-3  ${theme === 'on' ? 'text-black' : "text-white"} `}>

                <input value={'off'} onChange={handleChangeTheme} type="checkbox" />
                <svg className="swap-on fill-current w-5 h-5 lg:w-10 lg:h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                <svg className="swap-off fill-current w-5 h-5 lg:w-10 lg:h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>

            </label>
            <BiLogOut onClick={() => window.location.reload()} className={`lg:text-4xl z-50 text-xl cursor-pointer fixed   lg:top-6  left-5 top-3  ${theme === 'on' ? 'text-black' : "text-white"} `} />


            {loading && <Loading />}
            <div className={`lg:w-10/12 mx-2 w-full h-[600px] shadow  ${theme === 'on' ? 'bg-gray-200' : "bg-slate-700 "}  rounded-xl flex relative  `}>

                {/* side bar container starts*/}
                <div className={`w-20 h-full  ${theme === 'on' ? 'bg-gray-600' : "bg-slate-800  "} rounded-xl flex flex-col   items-center justify-start py-4 text-white gap-4`}>

                    <div onClick={() => setShowName(true)} className="avatar placeholder tooltip tooltip-open tooltip-top">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                            <span>{userData?.name.substring(0, 2)}</span>
                        </div>
                    </div>
                    {
                        showName && <div ref={showNameRef} className='absolute z-50  left-16 top-10 text-center min-w-max chat-bubble   bg-slate-900 text-white px-3 py-4'>
                            <p className='text-xl '>{userData?.name}</p>
                        </div>
                    }
                    {
                        createGroup && <div ref={showNameRef} className='absolute z-50 flex-col items-center justify-center left-16 top-60 text-center w-96 flex  bg-slate-800 text-white px-3 py-4'>
                            <form onSubmit={handleCreateGroup} className='w-full h-full flex flex-col items-center justify-center'>
                                <div className='flex flex-col text-start px-2 w-full mb-2'>
                                    <label htmlFor="name" className='mb-2'>Group Name</label>
                                    <input onChange={(e) => setGroupName(e.target.value)} required type="text" id='name' placeholder="Group Name here" className="bg-transparent outline-none border rounded-xl px-3 border-slate-600 py-2 text-white w-full" />
                                </div>
                                <Select
                                    onChange={(e) => setSelectedGroupUsers(e.map((user: any) => user.value))}
                                    defaultValue={[]}
                                    isMulti
                                    name="colors"
                                    options={selectUsers}
                                    className=" w-full bg-slate-900 text-white mb-2"
                                    classNamePrefix="Select members"
                                />
                                <button type='submit' className='btn btn-wide btn-primary'>Create Group</button>
                            </form>


                        </div>
                    }

                    <PiChatsFill onClick={() => setShowConversationBox('basic')} data-tip="Groups" className="cursor-pointer my-3 text-xl tooltip tooltip-open tooltip-top" />
                    <FaUserGroup onClick={() => setShowConversationBox('group')} data-tip="Groups" className="cursor-pointer my-3 text-xl tooltip tooltip-open tooltip-top" />
                    <MdGroupAdd onClick={() => setCreateGroup(true)} data-tip="Create Group" className="cursor-pointer my-3 text-xl tooltip tooltip-open tooltip-top" />


                </div>
                {/* side bar container ends */}

                    {/* container to start conversations */}
                <div className={`lg:flex ${chatSelected ? "hidden" : "flex"}  w-full py-2 lg:w-4/12 h-full   flex-col`}>
                    <div className={`w-full h-[4.4rem] flex items-center justify-center  ${theme === 'on' ? 'bg-gray-200' : "bg-slate-700  "}  text-center`}>
                        <div className={`w-4/5 rounded-xl flex items-center justify-center ${theme === 'on' ? 'bg-white' : "bg-slate-800  "} `}>
                            < BiSearch className={`text-xl  ${theme === 'on' ? 'text-black' : "text-white  "} mx-4`} />
                            <input onChange={handleSearchInputChange} type="text" placeholder="Search..." className={` px-2 py-3 outline-none bg-transparent border-0  ${theme === 'on' ? ' text-black' : " text-white  "}   w-full max-w-full `} ></input>
                        </div>

                    </div>
                    <div className={`  w-full h-full  ${theme === 'on' ? 'bg-gray-200' : "bg-slate-700  "}   overflow-y-auto   overflow-x-hidden py-2`}>

                        {
                            showConversationBox === 'basic' ?
                                <>
                                    {filterItems(searchTerm)?.map((user, index) => (
                                        <ConversationCard key={user?._id + index} user={user} />
                                    ))}
                                </>
                                :
                                <>
                                    {
                                        filterItems(searchTerm)?.map((group, index) => (
                                            <GroupConversationCard  key={group?._id + index} group={group}  />
                                        )
                                        )
                                    }

                                </>

                        }

                    </div>

                </div>
                {/* container to start conversations */}

                {/* container to show chats */}
                <div className={`${chatSelected ? "flex w-full" : "hidden"} w-8/12 rounded-xl h-full  lg:flex  flex-col`}>

                    {chatSelected === 'basic' ? (
                        <ChatCard />
                    ) : chatSelected === 'group' ? (
                        <GroupChatCard  getGroupChat={getGroupChat} setShowConversationBox={setShowConversationBox} />
                    ) : (
                        <DummyChatCard />
                    )}

                </div>
                {/* container to show chats */}

            </div>
            <ToastContainer />
            <p className={`fixed text-sm lg:text-base bottom-2 lg:bottom-5 text-center  ${theme === 'on' ? 'text-black' : "text-white"} `}>Created By Abdullah Moiz</p>
        </div>
    )
}



