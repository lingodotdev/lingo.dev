import express from 'express';
import DataModelSchema from '../Data_model/userdatamodel.data_model.js';
import { TokenGeneration } from '../middleware/tokenGeneration.js';

const router = express.Router()


router.post("/login", async (req, res) => {
  const {email, pass } = req.body;

  try {
    const existingUser = await DataModelSchema.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User Not Found" });
    }

    if (existingUser.pass !== pass) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = TokenGeneration(existingUser._id, existingUser.email);

    res.cookie("token", token, {
      // path: '/',
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "Lax",
      // maxAge: 1h
    });

    return res.status(200).json({ message: "Login Success" });
  } catch (error) {
    console.error("❌ Error during login:", error);
    return res.status(500).json({ message: "Login Failed" });
  }
});



export default router