import express from "express";
import cors from "cors";
import config from "./config/env.config";
import authRoute from "./routes/auth";
import matchRoute from "./routes/match";
import createUserRoute from "./routes/user";
import aiChatRoute from "./routes/chat";

const port = config.port;
const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/user", createUserRoute);
app.use("/api/match", matchRoute);
app.use("/api/aastha", aiChatRoute);

app.listen(port, () => {
    console.log(`Listening at port: ${port}`);
})