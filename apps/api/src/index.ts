import { env } from "./env.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono()
  
  // CORS設定 - Next.js連携
  .use('*', cors({
    origin: env.NODE_ENV === 'development' 
      ? ['http://localhost:3000'] 
      : ['https://your-domain.vercel.app'],
    credentials: true,
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }))
  
  // ログ設定
  .use('*', logger())
  
  // 仮のTodos Route（Phase 2で実装）
  .get('/api/todos', (c) => {
    return c.json({ todos: [], total: 0, hasNext: false });
  })
  
  // ヘルスチェック
  .get('/', (c) => {
    return c.text(
      `Todo API Server! Environment: ${env.NODE_ENV || 'development'}, Log Level: ${env.LOG_LEVEL}`
    );
  });

/**
 * AppType Export - Next.js側での型安全呼び出し実現
 */
export type AppType = typeof app;

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
