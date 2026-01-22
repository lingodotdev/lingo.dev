import mongoose from "mongoose";

const UserUploadDataSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"DataModel"
    },
    username:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required:true
    }
}, {timestamps:true})

export const UserUploadData = mongoose.model("UserUploadData", UserUploadDataSchema)


