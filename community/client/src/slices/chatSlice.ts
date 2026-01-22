import { createSlice } from '@reduxjs/toolkit'
import { chatState } from '../types'



const initialState: chatState = {
    userOnline: false,
    typing: false,
    typerID: {
        senderId: '',
        receiverId: ''
    },
    userMessageLoading: false,
    chatSelected: '',
    allUsers: [],
    receiverSelected: null,
    messages: [],
    searchUsers: [],
    allGroups: [],
    groupSelected: null,
    someOneTyping: false,
    groupMessages: {},

}

export const chatSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        setChatSelected: (state, action) => {
            state.chatSelected = action.payload
        },
        setAllUserData: (state, action) => {
            state.allUsers = action.payload
        },
        setAllGroups: (state, action) => {
            state.allGroups = action.payload
        },
        setReceiverSelected: (state, action) => {
            state.receiverSelected = action.payload
        },
        setMessages: (state, action) => {
            const newMessages = Array.isArray(action.payload) ? action.payload : [action.payload]
            if (newMessages.length === 0) {
                state.messages = []
                return
            } else {
                state.messages = [...state.messages, ...newMessages]
            }
        },
        setSearchUser: (state, action) => {
            state.searchUsers = action.payload
        },
        setGroupSelected: (state, action) => {
            state.groupSelected = action.payload
        },
        setUserMessageLoading: (state, action) => {
            state.userMessageLoading = action.payload
        },
        setTyping: (state, action) => {
            state.typing = action.payload
        },
        setTyperID: (state, action) => {
            state.typerID = action.payload
        },
        setSomeoneTyping: (state, action) => {
            state.someOneTyping = action.payload
        },
        setUserIsOnline: (state, action) => {
            state.userOnline = action.payload
        },
        setGroupMessages: (state, action) => {
            const { groupId, messages } = action.payload;

            if (Array.isArray(messages)) {
                // Check if the messages are received from Socket.IO
                const isFromSocketIO = messages.some(message => message.isFromSocketIO);

                if (isFromSocketIO) {
                    // Append the new messages to the existing conversation
                    if (state.groupMessages[groupId]) {
                        state.groupMessages[groupId].messages.push(...messages);
                    } else {
                        state.groupMessages[groupId] = {
                            groupId,
                            messages: [...messages]
                        };
                    }
                } else {
                    // Replace the existing messages with the newly fetched messages
                    state.groupMessages[groupId] = {
                        groupId,
                        messages: [...messages]
                    };
                }
            } else {
                // Replace the existing messages with a single message
                state.groupMessages[groupId] = {
                    groupId,
                    messages: [messages]
                };
            }
        }



        // setGroupMessages: (state, action) => {
        //     const { groupId, messages } = action.payload;
        //     if (Array.isArray(messages)) {
        //         if (state.groupMessages[groupId]) {
        //             state.groupMessages[groupId].messages.push(...messages);
        //         } else {
        //             state.groupMessages[groupId] = {
        //                 groupId,
        //                 messages: [...messages]
        //             };
        //         }
        //     } else {
        //         if (state.groupMessages[groupId]) {
        //             state.groupMessages[groupId].messages.push(messages);
        //         } else {
        //             state.groupMessages[groupId] = {
        //                 groupId,
        //                 messages: [messages]
        //             };
        //         }
        //     }
        // }

    },
})

export const {
    setChatSelected, setAllUserData, setReceiverSelected, setUserMessageLoading,
    setMessages, setSearchUser, setAllGroups, setGroupSelected, setTyping,
    setTyperID, setSomeoneTyping, setUserIsOnline, setGroupMessages
} = chatSlice.actions
const chatReducer = chatSlice.reducer
export default chatReducer