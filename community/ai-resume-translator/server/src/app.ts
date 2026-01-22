import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import ApiError from "./utils/ApiError";
import ApiResponse from "./utils/ApiResponse";
import translateRouter from "@/routes/translate.routes.js";

const app = express();

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

// Routes
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
