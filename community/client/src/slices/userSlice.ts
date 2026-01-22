import { createSlice } from '@reduxjs/toolkit'
import { userState } from '../types'



const initialState: userState = {
    themeLight : 'off',
    token : '',
    user : null
}

export const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        setToken : (state, action) => {
            state.token = action.payload
        },
        setUserData : (state, action) => {
            state.user = action.payload
        },
        setTheme : (state, action) => {
            state.themeLight = action.payload
        }
    },
})

export const { setToken , setUserData  , setTheme} = userSlice.actions
const userReducer = userSlice.reducer
export default userReducer