/**
 * Next.js (web) 向け環境変数のスキーマ定義と型安全なアクセスヘルパー。
 * - サーバ専用とクライアント露出の線引き（NEXT_PUBLIC_）を明確化
 * - 依存箇所はこのモジュールから import する
 */
import { z } from "zod";

const serverSchema = z.object({
  INTERNAL_API_BASE_URL: z.string().url(),
  INTERNAL_FEATURE_FLAG_TODO_BETA: z
    .enum(["0", "1"])
    .default("0"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional().default(""),
});

/** 環境変数（サーバ側） */
export type EnvServer = z.infer<typeof serverSchema>;
/** 環境変数（クライアント側） */
export type EnvClient = z.infer<typeof clientSchema>;

export const envServer: EnvServer = Object.freeze(
  serverSchema.parse({
    INTERNAL_API_BASE_URL: process.env.INTERNAL_API_BASE_URL,
    INTERNAL_FEATURE_FLAG_TODO_BETA: process.env.INTERNAL_FEATURE_FLAG_TODO_BETA,
  })
);

export const envClient: EnvClient = Object.freeze(
  clientSchema.parse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  })
);