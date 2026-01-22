import mongoose from "mongoose";


const ChatSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: [true, "Please provide a sender"],
    },
    receiver: {
        type: String,
        required: [true, "Please provide a receiver"],
    },
    message: {
        type: String,
        required: [true, "Please provide a message"],
    },
    typing : {
        type : Boolean,
        default : false
    },
    read : {
        type : Boolean,
        default : false
    },
    
    
},{timestamps : true});

const Chat = mongoose.models.chats ||  mongoose.model("chats", ChatSchema);

export default Chat;