import { Router } from "express";
import { createUser } from "../controllers/createUser";
import { setEmotionalScore } from "../controllers/setEmotionalScore";
const router = Router();

router.post("/create-profile", createUser);
router.post("/set-score", setEmotionalScore);

export default router;