const mongoose = require('mongoose');
// MongoDB connection
async function connectDb(){
   mongoose.connect(process.env.MONGO_URL)
  .then(()=>console.log("✅ mongoDb connected"))
  .catch((err)=>console.log("error",err));
}
module.exports={connectDb};
