import express from 'express'
import DataModelSchema from '../Data_model/userdatamodel.data_model.js';

let router = express.Router()


router.post("/register", async (req, res) => {
  const { firstname, lastname, email, pass } = req.body;

  try {
    const existingUser = await DataModelSchema.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await DataModelSchema.create({ firstname, lastname, email, pass });
    console.log(" User registered:", newUser.email);

    res.status(201).json({ message: "Registration Successful" });
  } catch (err) {
    console.error(" Registration error:", err);
    res.status(500).json({ message: "Registration Failed" });
  }
});


export default router;