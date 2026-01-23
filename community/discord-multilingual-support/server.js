require("dotenv").config();
const express = require('express');
const app = express();
//MongoDB connection
const {connectDb} = require("./connection");
connectDb();
//Discord event handling
require('./routes/discord-event');
//mongodb connection and discord event handling
//Deployment stuffs
app.get('/', (_req, res) => res.send('Bot is running'));

app.listen(process.env.PORT, () => console.log(`server up at port ${process.env.PORT}`));


