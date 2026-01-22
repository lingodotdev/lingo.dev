import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    phone: {
        type: Number,
        required: [true, "Please provide a Phone Number"],
    },
    online: {
        type: Boolean,
        default: false,
    }

},{timestamps : true});

const User = mongoose.models.users ||  mongoose.model("users", UserSchema);

export default User;