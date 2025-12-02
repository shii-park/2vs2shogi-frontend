# -- Base Stage (共通の土台) --
FROM node:18-alpine AS base
WORKDIR /app

# Next.jsをDockerをalpineで動かすための必須ライブラリ
RUN apk add --no-cache libc6-compat

# -- Dependencies Stage (ライブラリのインストール) --
FROM base AS deps
# ライブラリのリストだけを先にコピーすることで、ソースコードを変更してもライブラリの再インストールが発生しないようにする
COPY package.json package-lock.json* ./
# ライブラリのリストを元にインストールする
RUN npm ci

# -- Development Stage (開発用) --
FROM base AS dev
WORKDIR /app
# depsステージで作った/app/node_modulesディレクトリを現在のステージにコピー
COPY --from=deps /app/node_modules ./node_modules
# 手元のすべてのファイルをコンテナ内にコピー
COPY . .
# 開発サーバの起動
CMD ["npm","run","dev"]

# -- Builder Stage (本番ビルド用) --
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# -- Production Stage (本番用) --
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

EXPOSE 3000
CMD ["node", "server.js"]