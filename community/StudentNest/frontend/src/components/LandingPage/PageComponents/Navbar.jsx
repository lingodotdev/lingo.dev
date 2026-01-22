import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
// import dotenvx from '@dotenvx/dotenvx'
import axios from "axios";
import { Buffer } from "buffer";

// dotenvx.config()

export default function Navbar() {
  const [userBox, setUserBox] = useState(false);
  const [setting, setSetting] = useState(false);
  const [userdata, setuserdata] = useState(false);
  const navigate = useNavigate();
  const [image, setupload] = useState(null)
  const [description, setdesc] = useState('')
  const [phone, setphone] = useState('')
  const [username, setusername] = useState('')
  const [price, setprice] = useState('')
  const [location, setlocation] = useState('')

  const UploadHandler = async (e) => {
    e.preventDefault();

    if (!image || !description.trim() || !phone || !username || !price || !location) {
      alert("Please ensure to fill all data fields.");
      return;
    }
    try {
      const data = new FormData()
      data.append('image', image)
      data.append('description', description)
      data.append('phone', `+91 ${phone}`)
      data.append('username', username)
      data.append('location', location)
      data.append('price', price)
      await axios.post("http://localhost:3000/upload",
        data
      );
      alert("Upload successful!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed: " + (error.message || error));
    }
  };


  const userBoxRef = useRef(null);

  const settingRef = useRef(null);

  const toggleUserBox = () => setUserBox(!userBox);
  const toggleSettings = () => setSetting(!setting);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/profile", {
          withCredentials: true, // Important to send cookie
        });

        setuserdata(res.data.email);
      } catch (err) {
        console.error("Not authenticated:", err);
      }
    };

    fetchProfile();
  });

  // Handle click outside for both userBox and settings
  useEffect(() => {
    function handleClickOutside(event) {
      // Close userBox if clicked outside
      if (userBoxRef.current && !userBoxRef.current.contains(event.target)) {
        setUserBox(false);
      }

      // Close settings if clicked outside
      if (settingRef.current && !settingRef.current.contains(event.target)) {
        setSetting(false);
      }
    }

    // Add event listener when either is open
    if (userBox || setting) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userBox, setting]);

  const handleLogout = async () => {
    await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include",
    });

    const res = await axios.get("http://localhost:3000/profile", {
      withCredentials: true, // Important to send cookie
    });

    setuserdata(res.data.email);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 12 }}
      className="fixed top-4 z-50 w-full flex justify-center items-center"
    >
      <div className="w-[90%] max-w-7xl flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-lg shadow-xl rounded-full border border-white/40">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/"
            className="text-3xl font-bold tracking-tight flex items-center space-x-1"
          >
            <span className="text-purple-600">Student</span>
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Nest
            </span>
          </Link>
        </motion.div>

        {/* Links */}
        <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <Link to="/room" className="hover:text-purple-600 transition">
            Get Room
          </Link>
          {/* <Link to="/hotel" className="hover:text-purple-600 transition">
            Get Hotels
          </Link> */}
          <Link to="/about" className="hover:text-purple-600 transition">
            About
          </Link>
          <Link to="/connectus" className="hover:text-purple-600 transition">
            Connect Us
          </Link>
        </div>

        {/* Profile Icon */}
        <button
          onClick={toggleUserBox}
          className="hover:scale-105 transition duration-200"
        >
          <PersonIcon style={{ fontSize: 28 }} />
        </button>

        {/* Dropdown (Animated with AnimatePresence) */}
        <AnimatePresence>
          {userBox && (
            <motion.div
              ref={userBoxRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-8 top-16 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-44 flex flex-col space-y-3 z-50"
            >
              <button
                onClick={toggleSettings}
                className="text-left hover:text-purple-600 transition"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-left hover:text-red-500 transition"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slide-in Settings Panel */}
      <AnimatePresence>
        {setting && (
          <motion.div
            ref={settingRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed top-0 right-0 h-full w-[80vw] max-w-xl bg-gray-300 p-6 shadow-2xl z-40 rounded-l-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Profile</h2>
              <button
                onClick={() => setSetting(false)}
                className="text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </div>
            <span className="text-gray-700 flex-row ">
              {/* <img
                src="https://i.pinimg.com/736x/71/9c/58/719c586b0264e2a10d5706529bc7c9d5.jpg"
                alt=""
                className="h-[200px] w-[200px] rounded-full border-1 border-black mt-10 ml-40"
              /> */}
              <div className="text-2xl text-black ml-40 mt-5">
                {userdata?.firstname} {userdata?.lastname}
              </div>

              <br />

              <form
                className="w-full flex flex-col space-y-4"
                method="post"
                encType="multipart/form-data"
                onSubmit={UploadHandler}
              >
                {/* <h1 className="text-2xl font-semibold text-gray-800">Add Images</h1> */}

                <input
                  type="file"
                  accept="image/*"
                  className="border rounded-lg p-2"
                  onChange={(e) => setupload(e.target.files[0])}
                />
                <textarea
                  type="text"
                  className="h-10 w-full border rounded-lg p-1.5 resize-none"
                  placeholder="Enter Name"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                />

                <textarea
                  type="text"
                  className="h-10 w-full border rounded-lg p-1.5 resize-none"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setprice(e.target.value)}
                />
                <textarea
                  type="text"
                  className="h-10 w-full border rounded-lg p-1.5 resize-none"
                  placeholder="location"
                  value={location}
                  onChange={(e) => setlocation(e.target.value)}
                />
                <textarea
                  type="text"
                  className="h-10 w-full border rounded-lg p-1.5 resize-none"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setphone(e.target.value)}
                />
                <textarea
                  type="text"
                  className="h-30 w-full border rounded-lg p-4 resize-none"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setdesc(e.target.value)}
                />

                <button
                  type="submit"
                  className="w-40 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full self-center">
                  Submit
                </button>
              </form>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}


