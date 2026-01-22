import { Router } from "express";
import { logout } from "../controllers/auth";
const router = Router();

router.post("/logout/:uid", logout);

export default router;