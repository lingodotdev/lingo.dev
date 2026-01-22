import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import config from "./config/index.js";
import initializeSocketServer from "./socket-server/index.js";
import chatRoutes from "./api/chat.js";
import documentRoutes from "./api/documents.js";
import analyticsRoutes from "./api/analytics.js";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use("/api/chat", chatRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/analytics", analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// Initialize Socket.io handlers
initializeSocketServer(io);

// Start server
httpServer.listen(config.port, () => {
  console.log("");
  console.log("🚀 LinguaVerse Server Started");
  console.log("================================");
  console.log(`📡 Server: http://localhost:${config.port}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔌 Socket.io: Ready`);
  console.log(`🌐 CORS: ${config.corsOrigin}`);
  console.log(
    `🔑 Lingo.dev: ${config.lingo.apiKey ? "Configured ✅" : "Not configured ⚠️"}`,
  );
  console.log("================================");
  console.log("");
});

export default app;
