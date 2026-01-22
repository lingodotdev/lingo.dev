import express from 'express';
import dotenvx from '@dotenvx/dotenvx';
import { UserUploadData } from '../Data_model/UserUploadData.models.js';
import cloudinary from 'cloudinary';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenvx.config();

const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECERATE_API,
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { description, phone, username, user, price, location } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { resource_type: 'image' },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ message: "Upload to Cloudinary failed" });
        }

        const ImgUrl = result.secure_url;

        const SaveData = await UserUploadData.create({
          user,
          image: ImgUrl,
          location,
          price,
          username,
          phone,
          description
        });

        return res.status(200).json({ message: "Upload success", data: SaveData });
      }
    );

    uploadStream.end(file.buffer);
  } catch (error) {
    console.error("Got Error", error);
    return res.status(500).json({ error: "Something went wrong", details: error.message });
  }
});


export default router;
