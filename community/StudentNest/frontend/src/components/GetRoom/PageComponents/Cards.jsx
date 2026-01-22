// src/components/Cards.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function Cards() {
  const [data, setData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null); // holds clicked card

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://studentnestbackend.onrender.com/roomsdata');
        setData(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  if (selectedCard) {
    return (
      <div className="min-h-screen bg-white text-slate-700">
        <motion.div
          className="relative w-full h-[70vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img
            src={selectedCard.image}
            alt="Room"
            className="w-full h-full object-cover"
          />
          <motion.h1
            className="absolute top-[70%] left-0 h-[7%] w-[60vw] md:w-[25vw] rounded-r-full bg-white text-2xl font-semibold flex items-center justify-center shadow-lg"
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            {selectedCard.username}'s Room
          </motion.h1>
        </motion.div>

        <motion.div
          className="flex flex-col items-start gap-5 px-10 mt-10 mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >

          <div className="text-2xl absolute right-5 bg-red-500 text-white p-2 px-10 rounded-3xl">
            <strong>Price:</strong> {selectedCard.price}
          </div>

          <div className="text-2xl">
            <strong>location:</strong> {selectedCard.location}
          </div>

          <div className="text-2xl">
            <strong>Phone:</strong> {selectedCard.phone}
          </div>

          <div className="text-2xl">
            <strong>Description:</strong>
          </div>

          <div className="text-xl pl-4 border-l-4 border-blue-300">
            {selectedCard.description}
          </div>
          <div className='bg-yellow-300 flex justify-evenly flex-row w-full p-5 rounded-2xl mt-20'>
            <h1 >
            <strong>
              Note :-  
            </strong>
            WE RECOMMEND YOU ALL TO VISIT THE ROOMS OR FLATS IN PHYSICAL MODE BEFORE FINALIZATION OF FLAT OR ROOM ...
            </h1>
          </div>
        </motion.div>

        {/* <motion.button
          className="bg-red-500 mb-5 pt-2 pb-2 text-xl w-[30vw] mx-auto block rounded-full text-white hover:bg-red-600"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Connect with Owner
        </motion.button> */}
      </div>
    );
  }

  return (
    <div className="h-auto bg-white pt-[15vh] px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.map((item, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSelectedCard(item)}
        >
          <img
            src={item.image}
            alt={`Room ${index}`}
            className="w-full h-[250px] object-cover"
          />
          <div className="p-4 font-semibold text-lg text-slate-700">
            {item.username} 
          </div>
          <div className="px-4 pb-4 text-slate-700">
            Need to Pay - {item.price} $
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default Cards;
