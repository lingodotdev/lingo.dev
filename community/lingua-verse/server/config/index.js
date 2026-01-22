import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root
dotenv.config({ path: join(__dirname, "../../.env") });

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  lingo: {
    apiKey: process.env.LINGO_API_KEY,
  },
  cache: {
    ttl: 3600, // 1 hour in seconds
    checkPeriod: 600, // Check for expired keys every 10 minutes
  },
};

// Validate required configuration
if (!config.lingo.apiKey) {
  console.warn(
    "⚠️  Warning: LINGO_API_KEY is not set. Translation features will not work.",
  );
}

export default config;
