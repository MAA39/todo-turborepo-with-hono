# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 🚨 最重要方針

# タスク概要（結論ファースト）
example
- 目的: <何のために/誰のために。例: リモートSupabaseへ安全にDB変更を適用>
- 成果物: <最終アウトプット。例: 変更パッチ、実行手順、検証ログ、コミットメッセージ案>

# 固定コンテキスト（プロジェクト規約）
- Next.js App Router は **RSC/SSR優先**。`page.tsx` は **Client化しない**（重要）。
- データ取得は **RSC/SSR優先**、頻繁更新やユーザー固有は Client(SWR 等)。
- Hono は **Vercel Node ランタイム**で動かす（Edge前提にしない）。
- Drizzle: **本番は migration ベース**。push は開発専用。
- TypeScript は NodeNext 解決。既存 `@workspace/*` を尊重。
- 触って良い範囲: <例: packages/api/* と packages/database/* のみ>
- 触ってはダメ: <例: web の RSC 境界や共有 UI を壊す変更>

# 制約・前提
- 使って良いコマンド/ツール: <例: pnpm, drizzle-kit, supabase cli>
- 環境変数: <例: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY>
- 外部APIや認可: <例: Better Auth 現状設定を前提>

# 対象ファイル/領域
- 例:
  - `packages/database/drizzle.config.ts`
  - `packages/api/src/db/*`
  - `packages/auth/auth.ts`（Better Auth の Drizzle adapter 前提）

# 作戦（Planの提示を要求）
- 最初に **Plan** を3〜6手順で提示してから着手。
- 不明点は **最初の1回でまとめて**質問してから進める。

# 成果物フォーマット（必須）
- 変更パッチ（ファイルごとの差分）
- 実行コマンド（コピペ可能）
- 検証観点とテスト結果要約
- ロールバック手順
- コミットメッセージ案（Conventional Commits）

# 検収条件（Exit Criteria）
- ローカルで <コマンド> 実行時に <期待結果> が得られる
- 型チェック / lint / ビルドが通る（コマンド明記）
- 既存エンドポイント/<機能>が回帰しないことを確認できる根拠あり

# 禁止事項
- Edge向け最適化の先走り変更
- `page.tsx` の Client 化
- マイグレーションを生成せずに本番DBへ直接変更

## コンテキスト効率化とエージェント活用

**CRITICAL**: コンテキスト圧迫を避けるため、調査・情報収集は**必ずエージェントまたはサブエージェントに委託**すること。

### 調査・情報収集のルール
1. **Web検索・技術調査**: 必ずTask toolでエージェントに委託
2. **メイン担当者の役割**: エージェントからの報告確認と判断のみ
3. **知識の更新**: 古い知識に依存せず、常に最新情報をエージェント経由で取得
4. **効率重視**: 直接WebSearchやWebFetch使用禁止（コンテキスト浪費）

### エージェント・MCP活用が効果的な領域
以下の作業では、コンテキスト消費を承知の上でエージェント・MCPツールを積極活用：

1. **Web検索・最新技術調査**
   - 新しいライブラリ・フレームワークの調査
   - ベストプラクティスやトラブルシューティング情報
   - 公式ドキュメントの最新情報取得

2. **コードベース探索・検索**
   - 隠しファイル・設定ファイルの発見
   - コマンドやパスの探索（`.claude/agents`等）
   - 複雑な実装パターンの理解
   - MCP Serenaによる効率的なコード調査

3. **専門領域の深掘り調査**
   - 特定技術スタックの詳細仕様
   - セキュリティ・パフォーマンス最適化
   - アーキテクチャ設計の検証

### 使い分けガイドライン
- **簡単な実装**: 直接実装（コンテキスト節約優先）
- **調査が必要**: エージェント委託（効果重視）
- **判断迷う場合**: 人間に相談してから決定

### 実行例
```
❌ 直接調査（コンテキスト圧迫）:
WebSearch("Claude Code hooks") → 大量の検索結果 → コンテキスト消費

✅ エージェント委託（効率的）:
Task tool → general-purpose agent → "Claude Code hooksを調査" → 簡潔な報告のみ受領
```

## コード品質方針

指示をもとに適切でシンプルなコード（適当に書いて良いわけではない）を書いてください。
他の実装を参考にすること、適切に調査を行うこと、その上でコードを書くこと。
YAGNI原則を守ること。
今必要なものだけを書くこと。

## Project Overview

This is a Turborepo monorepo project called "fukushi-navi-plus" combining a Hono API backend with a Next.js frontend. The project uses pnpm as the package manager and Turbo for build orchestration.

## Architecture

### Monorepo Structure

- **`apps/api`**: Hono API server (runs on port 8787)
- **`apps/web`**: Next.js web application (runs on port 3000)
- **`packages/ui`**: Shared React component library
- **`packages/eslint-config`**: Shared ESLint configurations
- **`packages/typescript-config`**: Shared TypeScript configurations

### Technology Stack

- **Package Manager**: pnpm (v9.0.0)
- **Build System**: Turborepo (stream UI mode for copy-paste friendly output)
- **Backend**: Hono v4.9.2 (lightweight web framework)
- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript 5.8.x
- **Runtime**: Node.js 18+

## Essential Commands

```bash
# Install dependencies
pnpm install

# Development - run all apps (stream output, copy-paste friendly)
pnpm dev

# Development - run specific app
pnpm dev:web
pnpm dev:api
# or
pnpm dev --filter=web
pnpm dev --filter=api

# Alternative: explicit stream output
pnpm dev:stream

# Build all apps
pnpm build

# Build specific app
pnpm build --filter=web

# Type checking
pnpm check-types

# Linting
pnpm lint

# Format code
pnpm format
```

## API Integration

The web app connects to the Hono API with environment-aware URLs:

- **Production**: `https://fukushi-navi-plus-api.vercel.app`
- **Development**: `http://localhost:8787`

The API URL is configured in `apps/web/app/page.tsx` and automatically switches based on the `VERCEL` environment variable.

## Development Workflow

### Starting Development

1. The API runs on port 8787 (configured in `apps/api/src/index.ts`)
2. The web app runs on port 3000 (configured in `apps/web/package.json`)
3. Both apps start simultaneously with `pnpm dev`

### Working with Shared Packages

- UI components are in `packages/ui/src/`
- Components use `"use client"` directive for client-side rendering
- Import shared components with `@repo/ui` alias

### TypeScript Configuration

- Each app/package has its own `tsconfig.json` extending shared configs
- Type checking runs across all packages with `pnpm check-types`
- Strict mode configurations are inherited from base configs

## Key Architectural Decisions

### Turbo Configuration

The `turbo.json` defines:

- Build dependencies between packages
- Environment variable handling for Vercel deployment
- Output caching for `.next` and `.vercel` directories
- Persistent dev server sessions
- Stream UI mode (`"ui": "stream"`) for terminal-friendly output that supports text selection and copy-paste

### API Design

- The Hono API (v4.9.2) is minimal and designed for edge deployment
- Uses @hono/node-server for Node.js runtime
- CORS enabled for cross-origin requests
- Returns plain text responses (can be extended to JSON)
- Deployed separately from the frontend for scalability
- Hot reload enabled with tsx watch in development

### Frontend Patterns

- Server Components by default in Next.js App Router
- Theme-aware image component (`ThemeImage`) for dark/light mode
- CSS Modules for component styling

## Deployment Considerations

### Vercel Deployment

- The project is configured for Vercel deployment
- API and web apps deploy as separate services
- Environment detection via `process.env.VERCEL`

### Build Outputs

- Next.js outputs to `.next/` directory
- Vercel build artifacts in `.vercel/output/`
- All build outputs are gitignored

## Common Development Tasks

### Adding a New API Endpoint

1. Edit `apps/api/src/index.ts`
2. Add route handlers using Hono's routing syntax
3. Test locally at `http://localhost:8787`

### Creating UI Components

1. Add component to `packages/ui/src/`
2. Export from package index if needed
3. Use `"use client"` directive for interactive components
4. Import in apps with `@repo/ui`

### Modifying the Web App

1. Work in `apps/web/app/` directory
2. Follow Next.js App Router conventions
3. Server Components by default, use `"use client"` when needed

## Agent Usage Instructions

**CRITICAL**: Before implementing any solution, always check if there's an appropriate specialized agent available in `.claude/agents/`. If one exists that matches the task requirements, ALWAYS use that agent instead of implementing directly.

### Available Specialized Agents

The following agents are available and should be used for their respective domains:

#### Monorepo & RPC Architecture
- **`akira-monorepo-rpc-specialist`**: Use for Hono + Next.js monorepo setup, Turborepo optimization, RPC implementation, type-safe client/server communication, parseResponse patterns, and build pipeline optimization.
  - *When to use*: Monorepo structure changes, API client setup, Turborepo configuration, RPC patterns
  - *Example*: "Set up type-safe RPC between my Hono API and Next.js frontend"

#### Backend API Development
- **`takashi-hono-rpc-expert`**: Use for Hono API development, endpoint creation, type safety with AppType exports, Clean Architecture, Error-as-Value patterns, Zod validation, and backend quality improvements.
  - *When to use*: Creating new API endpoints, improving error handling, implementing Clean Architecture
  - *Example*: "Create a new user authentication API endpoint with proper error handling"

#### Frontend Development
- **`sakura-nextjs-swr-expert`**: Use for Next.js App Router development, SWR data fetching, optimistic updates, BFF patterns, hydration issues, and frontend performance optimization.
  - *When to use*: Next.js components, data fetching patterns, frontend optimization, hydration issues
  - *Example*: "Implement a todo list with real-time updates using SWR"

#### Architecture & DDD
- **`kenji-ddd-architect`**: Use for Domain-Driven Design, Clean Architecture, monorepo structure decisions, dependency management, and architectural guidance.
  - *When to use*: Architectural decisions, domain modeling, layer separation, dependency issues
  - *Example*: "Design the domain structure for a user management system"

#### Database & ORM
- **`hiroki-drizzle-postgres-expert`**: Use for database schema design, Drizzle ORM implementation, migrations, query optimization, and PostgreSQL-specific tasks.
  - *When to use*: Database schema changes, Drizzle queries, performance optimization
  - *Example*: "Design a database schema for user profiles with proper relationships"

#### Security & Authentication
- **`midori-better-auth-security`**: Use for authentication implementation, security reviews, Better Auth integration, CORS configuration, and security best practices.
  - *When to use*: Authentication setup, security reviews, CORS issues, security improvements
  - *Example*: "Implement secure user authentication with Better Auth"

#### DevOps & Automation
- **`yuko-devops-automation-expert`**: Use for CI/CD optimization, Vercel deployments, automation scripts, build optimization, and infrastructure improvements.
  - *When to use*: Build performance issues, deployment configuration, automation tasks
  - *Example*: "Optimize my Vercel deployment pipeline for faster builds"

#### Code Quality & Testing
- **`quality-focused-staff-engineer`**: Use for code reviews, test strategies, quality metrics, TDD implementation, and engineering best practices.
  - *When to use*: Code quality improvements, test strategy design, refactoring guidance
  - *Example*: "Review my API implementation and suggest improvements"

#### Analytics & User Behavior
- **`shingo-user-analytics-expert`**: Use for user analytics implementation, A/B testing, conversion optimization, and data-driven improvements.
  - *When to use*: Analytics setup, user behavior analysis, conversion optimization
  - *Example*: "Implement user event tracking for the signup flow"

#### Project Navigation
- **`serena-project-navigator`**: Use for comprehensive codebase analysis, project structure understanding, and navigating complex codebases.
  - *When to use*: Understanding large codebases, finding specific implementations, architectural analysis
  - *Example*: "Help me understand how authentication flows through this codebase"

#### Code Intelligence
- **`lsp-code-intelligence`**: Use for precise code analysis, symbol navigation, safe refactoring using Language Server Protocol capabilities.
  - *When to use*: Complex refactoring, symbol analysis, type-safe code changes
  - *Example*: "Safely rename this function across the entire codebase"

#### CTO-Level Architecture
- **`functional-ddd-cto`**: Use for strategic technical decisions, architectural reviews, functional programming guidance, and high-level system design.
  - *When to use*: Strategic technical decisions, architecture reviews, complex domain modeling
  - *Example*: "Review the overall architecture and suggest strategic improvements"

### Agent Usage Protocol

1. **Always Check First**: Before starting any implementation, determine if a specialized agent should handle the task
2. **Use Appropriate Agent**: Match the task to the most suitable agent based on the domain and expertise needed
3. **Provide Context**: When calling an agent, provide clear context about the current project state and specific requirements
4. **Follow Agent Recommendations**: Agents are specialized experts - trust their domain-specific guidance

### Example Agent Selection Decision Tree

```
Task: "Add user authentication to my Next.js app"
├─ Frontend focus? → sakura-nextjs-swr-expert (for UI components, forms)
├─ Backend API focus? → takashi-hono-rpc-expert (for auth endpoints)
├─ Security focus? → midori-better-auth-security (for auth strategy)
└─ Architecture focus? → kenji-ddd-architect (for auth domain design)
```

Task: "My Turborepo build is slow"
└─ akira-monorepo-rpc-specialist (Turborepo optimization expert)

Task: "Implement user tracking analytics"
└─ shingo-user-analytics-expert (analytics specialist)

### Important Notes

- **Never implement without checking**: Always verify if an agent should handle the task first
- **Agent expertise is comprehensive**: These agents have deep, specialized knowledge in their domains
- **Combine agents when needed**: Complex tasks may require multiple agents working on different aspects
- **Respect agent specialization**: Don't use a general approach when a specialist agent is available

## Code Investigation Protocol

**ABSOLUTE REQUIREMENT**: When a human requests code investigation, analysis, or exploration of the codebase, you MUST use Serena MCP tools for code investigation. This is mandatory and non-negotiable.

### Investigation Rules

1. **Mandatory Serena Usage**: For ANY investigation request, ALWAYS use:
   - `serena-project-navigator` agent, OR
   - Direct Serena MCP tools (mcp__serena__*)

2. **What Counts as Investigation**:
   - "調査して" (Please investigate)
   - "コードを見て" (Look at the code)
   - "実装を確認" (Check the implementation)
   - "どうなってる？" (How does it work?)
   - "構造を教えて" (Tell me the structure)
   - Any request to understand existing code

3. **Serena Tools Priority**:
   ```
   Investigation Request → MUST use Serena tools:
   ├─ Use serena-project-navigator agent (recommended)
   ├─ OR use mcp__serena__get_symbols_overview
   ├─ OR use mcp__serena__find_symbol
   ├─ OR use mcp__serena__search_for_pattern
   └─ NEVER use Read tool directly for code investigation
   ```

4. **Agent + Serena Combination**:
   - Other specialized agents (akira, takashi, etc.) CAN also use Serena tools
   - When using specialized agents for investigation, ensure they leverage Serena capabilities
   - Serena provides the investigation foundation, specialists provide domain expertise

### Examples

❌ **Wrong**:
```
Human: "このAPIの実装を調査して"
Assistant: Uses Read tool directly
```

✅ **Correct**:
```
Human: "このAPIの実装を調査して"
Assistant: Uses serena-project-navigator agent or mcp__serena__* tools
```

❌ **Wrong**:
```
Human: "認証の仕組みを教えて"
Assistant: Uses Grep/Read directly
```

✅ **Correct**:
```
Human: "認証の仕組みを教えて"
Assistant: Uses serena + midori-better-auth-security combination
```

### Investigation Workflow

1. **Receive investigation request** → Immediately identify as investigation task
2. **Choose Serena approach**:
   - Simple investigation → Direct Serena MCP tools
   - Complex investigation → serena-project-navigator agent
   - Domain-specific investigation → Specialized agent + Serena tools
3. **Never bypass Serena** for code investigation tasks

**This rule is ABSOLUTE and applies to all investigation requests, regardless of complexity or domain.**

## 進め方の重要な方針

**絶対に先行しすぎないこと**: このプロジェクトの人間は以下を非常に重視します：

1. **一歩ずつの進行**: 複数ファイルを同時に作成せず、必ず一つずつ確認を取りながら進める
2. **判断可能な粒度**: 人間が変更差分を理解し、判断できる範囲で作業を区切る
3. **管理可能な変更**: 30ファイル同時変更など、追跡不能な変更は絶対に避ける
4. **段階的確認**: 各ステップで必ず確認を求め、承認を得てから次に進む
5. **適切なコード品質**: 手抜きではなく、適切で理解しやすいコードを一つずつ丁寧に作成

**人間が嫌うこと**:
- コードが先行して進みすぎること
- 変更差分が大きすぎて追跡できないこと
- 判断材料なしに複数の選択を迫られること
- 一度に複数のファイル/機能が変更されること

**求められること**:
- 一緒に進めること（Human in the Loop）
- 適切で理解しやすいコード品質
- 段階的で予測可能な進行
- 常に確認を取りながらの協調作業

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
