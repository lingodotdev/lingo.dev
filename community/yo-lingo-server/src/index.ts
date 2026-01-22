import { Hono } from "hono";
import { cors } from "hono/cors";
import content from "./routes/content";

const app = new Hono();

app.use("*", cors());

app.route("/api", content);

app.get("/", (c) => c.text("Hono server running 🚀"));

const port = Number(Bun.env.PORT) || 3001;
console.log(`Server is running on port ${port} 🚀`);

export default {
  port,
  fetch: app.fetch,
};
