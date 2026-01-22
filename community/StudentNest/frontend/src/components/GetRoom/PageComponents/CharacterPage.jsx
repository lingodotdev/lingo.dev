// src/pages/CharacterPage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../../LandingPage/PageComponents/Navbar';

function CharacterPage() {
  const { id } = useParams(); // this is the unique ID from the URL
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get('https://studentnestbackend.onrender.com/upload');
        const room = response.data.find((item) => String(item.id) === id); // match ID from URL
        setData(room);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoomData();
  }, [id]);

  if (!data) return <div className="mt-[20vh] text-center text-xl">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <motion.div
        className="relative w-full h-[70vh] mt-[15vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={data.image}
          alt="Room"
          className="w-full h-full object-cover"
        />
        <motion.h1
          className="absolute top-[70%] left-0 h-[7%] w-[60vw] md:w-[25vw] rounded-r-full bg-white backdrop-invert text-2xl font-semibold font-sans flex items-center justify-center shadow-lg"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          Student Nest Room
        </motion.h1>
      </motion.div>

      <motion.div
        className="flex flex-col items-start gap-5 px-10 mt-15 mb-32"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="text-2xl text-slate-700 w-full">
          <strong>Description:</strong>
        </div>

        <motion.div
          className="text-xl text-slate-700 w-full pl-4 border-l-4 border-blue-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          {data.description}
        </motion.div>

        <div className="text-2xl text-slate-700 w-full">
          <strong>Contact:</strong> +91 72xxxxxxx5
        </div>
      </motion.div>

      <motion.button
        className="bg-red-500 mb-5 pt-2 pb-2 text-xl w-[30vw] relative left-[35vw] rounded-full hover:w-full hover:left-0 hover:rounded-none transition-all ease-out duration-300 text-white"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        Connect with Owner
      </motion.button>

      <footer className="h-[40px] bg-gray-400 w-full flex items-center justify-center text-slate-600 text-lg">
        Student Nest
      </footer>
    </div>
  );
}

export default CharacterPage;
