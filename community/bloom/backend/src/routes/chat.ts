import { Router } from "express";
import { startConversation } from "../controllers/chat"; 

const router = Router();

router.post("/chat", startConversation);

export default router;