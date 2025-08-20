/**
 * Hono (api) 向け環境変数のスキーマ定義。
 * Node ランタイム前提。将来 Workers/Bun へ移植するなら hono/adapter の env(c) を使う方針も可。
 */
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(8080),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.string().url(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type ApiEnv = z.infer<typeof schema>;
export const env: ApiEnv = schema.parse(process.env);