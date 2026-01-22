import { Router } from "express";
import { findMatch } from "../controllers/matchUsers";

const router = Router();

router.get("/find-match/:uid", findMatch);

export default router;