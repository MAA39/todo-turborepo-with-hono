/**
 * 環境変数ローダー - A-1方式（条件読み込み）
 * 開発時: .env.local を優先読み込み
 * 本番時: Vercel等の環境変数設定を使用
 */
import dotenv from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";

const isDevelopment = process.env.NODE_ENV !== "production";

if (isDevelopment) {
  // 開発時: .env.local を優先、存在しなければ .env を試行
  const localEnvPath = path.join(process.cwd(), ".env.local");
  const fallbackEnvPath = path.join(process.cwd(), ".env");

  if (existsSync(localEnvPath)) {
    dotenv.config({ path: localEnvPath });
    console.log(`🔧 Loaded environment from: .env.local`);
  } else if (existsSync(fallbackEnvPath)) {
    dotenv.config({ path: fallbackEnvPath });
    console.log(`🔧 Loaded environment from: .env`);
  } else {
    console.warn(`⚠️  No .env.local or .env found in ${process.cwd()}`);
  }
}
