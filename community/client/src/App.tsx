import { Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Chat from './pages/Chat'
import { io } from "socket.io-client";
import NotFound from './pages/NotFound';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';




export const socket = io("http://localhost:8000")

function App() {
  const user = useSelector((state: RootState) => state.User.user);

  useEffect(() => {
    socket.emit('userOnline', user?._id)
  }, [user])


  return (
    <Routes>
      <Route element={<Login />} path="/" />
      <Route element={<Chat />} path="/chat" />
      <Route element={<Register />} path="/register-account" />
      <Route element={<NotFound />} path="/*" />
    </Routes>
  )
}

export default App
