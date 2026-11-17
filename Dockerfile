# syntax=docker/dockerfile:1.7

ARG BUN_VERSION=1.3.14
ARG NODE_VERSION=22

# ---------------------------------------------------------------------------
# 1. deps — install dependencies from bun.lock (cached unless the lockfile changes)
# ---------------------------------------------------------------------------
FROM oven/bun:${BUN_VERSION}-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
	bun install --frozen-lockfile

# ---------------------------------------------------------------------------
# 2. builder — next build (standalone output)
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app

COPY --from=deps /usr/local/bin/bun /usr/local/bin/bun
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the client bundle at build time,
# so they must be passed as build args, not runtime env.
ARG NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
ENV NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=${NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG} \
	NEXT_TELEMETRY_DISABLED=1 \
	NODE_ENV=production

RUN bun run build

# ---------------------------------------------------------------------------
# 3. runner — minimal runtime image, non-root
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1 \
	PORT=3000 \
	HOSTNAME=0.0.0.0

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

# Standalone server (includes traced ./content and fonts via outputFileTracingIncludes)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
	CMD wget -q --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
