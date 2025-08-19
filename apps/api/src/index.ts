import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello from the Hono API!");
});

// For Vercel deployment
export default app;

// For local development with Node.js server
if (process.env.NODE_ENV !== "production") {
  const port = 8080;
  serve({
    fetch: app.fetch,
    port,
  });
  console.log(`Hono server running at http://localhost:${port}`);
}
