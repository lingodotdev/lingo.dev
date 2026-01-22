import dotenv from "dotenv";
dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
}

const config: Config = {
    port: parseInt(process.env.PORT!) || 3000,
    nodeEnv: process.env.NODE_ENV || "development"
}

export default config;
