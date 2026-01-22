import {
  getSupportedLanguages,
  translate,
} from "@/controllers/translate.controller";
import upload from "@/middleware/upload.middleware.js";
import { Router } from "express";

const router = Router();

router
  .post("/", upload.single("file"), translate)
  .get("/supported-languages", getSupportedLanguages);

export default router;
