import express from 'express'
import { UserUploadData } from '../Data_model/UserUploadData.models.js'

const router = express.Router()
router.get('/roomsdata', async (req, res) => {
  try {
    const data = await UserUploadData.find()
      .select('location price username image phone description'); 

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Failed to fetch rooms data' });
  }
});

export default router
