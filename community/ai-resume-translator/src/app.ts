import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import ApiError from "./utils/ApiError";
import ApiResponse from "./utils/ApiResponse";
import translateRouter from "@/routes/translate.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Middleware
app.use(
  cors({
    origin: process.env.ORIGIN || "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.get("/", (_: Request, res: Response) => {
  res.render("index", { title: "AI Resume Translator" });
});

app.get("/health", (_: Request, res: Response) => {
  res.status(200).json(
    new ApiResponse(200, "Server is running...", {
      status: "OK",
      message: "API is running...",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }),
  );
});

// External Routers
app.use("/api/v1/translate", translateRouter);

// Error handling middleware

// 404 Not Found Handler
app.use((_: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, "Route not found"));
});

// ERROR HANDLER
app.use((err: ApiError, _: Request, res: Response, __: NextFunction) => {
  res.status(err.statusCode).json(err);
});

// No app.listen here; this file is meant to be imported and used in index.ts.

export default app;
