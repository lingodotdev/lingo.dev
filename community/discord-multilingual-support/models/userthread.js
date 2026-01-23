const mongoose = require('mongoose');
const threadSchema = new mongoose.Schema({
  userId: String,
  username: String,
  threadId: String,
  guildId: String,
  language: { type: String, default: 'en' },
  lastUpdated: Date
});

const userthread = mongoose.model("UserThread", threadSchema);
module.exports={userthread};