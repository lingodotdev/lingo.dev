import express from 'express'
import jwt from 'jsonwebtoken'
import DataModelSchema from '../Data_model/userdatamodel.data_model.js';

const router = express.Router()


const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRATE_KEY);
    req.email = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

router.get("/profile", verifyUser, async (req, res) => {
  try {
    const email = await DataModelSchema.findById(req.email.id).select("-pass");
    if (!email) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ email });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});


export default router