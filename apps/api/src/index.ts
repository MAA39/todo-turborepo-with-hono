// 🚨 環境変数を最初に読み込み（他のimportより前に実行）
import "./bootstrap/env-load";

import { env } from "./env.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

//このGet内に環境変数を何かしら仕込んで、仮として表示させるようにしたい。以下例

app.get("/", (c) => {
  return c.text(
    `Good morning from the Hono API! Environment: ${env.NODE_ENV}, Log Level: ${env.LOG_LEVEL}`
  );
});

// For Vercel deployment
export default app;

// For local development with Node.js server
if (env.NODE_ENV !== "production") {
  const port = env.PORT;

  serve({
    fetch: app.fetch,
    port,
  });

  console.log(`Hono server running at http://localhost:${port}`);
}
