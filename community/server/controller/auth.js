import User from '../models/User.js'
import { registerSchemaValidation , LoginschemaValidation } from '../validations/index.js';
import pkg from 'bcryptjs';
const { hash , compare } = pkg;
import jwt from 'jsonwebtoken';


export const LoginUser = async (req, res) => {
    const data = req.body;
    const { email, password } = data;
    const { error } = LoginschemaValidation.validate({ email, password });

    if (error) return res.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) return res.json({ success: false, message: "Account not Found" });

        const isMatch = await compare(password, checkUser.password);
        if (!isMatch) return res.json({ success: false, message: "Incorrect Password" });

        const token = jwt.sign({ id: checkUser._id, email: checkUser.email }, process.env.JWT_SECREAT ?? 'default_secret_dumbScret', { expiresIn: '1d' });

        const finalData = {token , user : {name : checkUser.name , email : checkUser.email , phone : checkUser.phone , _id : checkUser._id,  online  : checkUser.online}}
        return res.json({ success: true, message: "Login Successfull",  finalData})

    } catch (error) {
        console.log("🚀 ~ file: index.js:28 ~ LoginUser ~ error:", error)
        return res.json({ success: false, message: "Something Went Wrong Please Retry Later !" })
    }
}


export const RegisterUser = async (req, res) => {
    const data =  req.body;
    const {name , email , password , phone} = data
    const { error } = registerSchemaValidation.validate( {name , email , password , phone} );

    if (error) return res.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

    try {
        const ifExist = await User.findOne({ email });
        
        if (ifExist) {
            return res.json({ success: false, message: "User Already Exist" });
        }

        else {
            const hashedPassword = await hash(password, 12)
            const createUser = await User.create({ email, name, password: hashedPassword , phone });
            if(createUser) return res.json({ success: true, message: "Account created successfully" });
        }
    } catch (error) {
        console.log("🚀 ~ file: index.js:55 ~ RegisterUser ~ error:", error)
        return res.json({ success: false, message: "Something Went Wrong Please Retry Later !" })
    }
}


