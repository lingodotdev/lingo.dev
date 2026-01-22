import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setemail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const LoginHandler = async (email, pass) => {
    if (!email || !pass) {
      alert("User and Password are required");
      return null;
    }

    try {
      const res = await axios.post(
        'https://studentnestbackend.onrender.com/login', // make sure backend route matches
        { email, pass },
        {
          withCredentials: true, // for cookie-based auth
        }
      );
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      alert(msg);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await LoginHandler(email, pass);
    if (res && res.status === 200) {
      // Optional: store token if backend sends it in response
      localStorage.setItem("token", res.data.token);
      navigate('/');
    }
  };

  const handleNewUser = () => {
    navigate('/register');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-tr from-orange-600 via-white to-white">
      {/* Foreground Form */}
      <div className="absolute z-10 flex items-center h-full left-30">
        <form
          onSubmit={handleSubmit}
          className="w-[30vw] h-[60vh] flex flex-col justify-center items-center backdrop-blur-2xl rounded-2xl shadow-2xl gap-10 overflow-hidden "
        >
          <h1 className="text-4xl text-black font-semibold">Log in</h1>

          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="p-2 border-blue-400 rounded-lg w-[80%] bg-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="p-2 border-blue-400 rounded-lg w-[80%] bg-white"
          />

          <button
            type="button"
            onClick={handleNewUser}
            className="hover:text-blue-400 text-black"
          >
            New User →
          </button>

          <button
            type="submit"
            className="backdrop-blur-lg bg-white shadow-2xl hover:bg-orange-400 text-black hover:text-white px-[5vw] py-2 rounded-full"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right Side Text */}
      <div className="flex flex-col gap-3 absolute right-10 h-full justify-center items-center w-[50vw]">
        <div className="flex text-purple-600 text-8xl font-sans">
          Student <h1 className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent ml-3">Nest,</h1>
        </div>
        <div className="text-slate-500 text-4xl">Welcome You</div>
      </div>
    </div>
  );
}

export default Login;
