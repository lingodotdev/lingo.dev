import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECREAT ?? 'default_secret_dumbScret';



const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
  try {
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Please login. We need a token to verify you!' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.log("🚀 ~ file: index.js:19 ~ jwt.verify ~ err:", err);
        return res.status(403).json({ success: false, message: 'You are not authorized.' });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.log("🚀 ~ file: index.js:15 ~ authenticateToken ~ error:", error);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

export default  authenticateToken ;
