# Stage 1: Base image
FROM node:18-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json .npmrc ./


COPY apps/notification-service/package.json ./apps/notification-service/

RUN pnpm install --filter notification-service --prod --frozen-lockfile

COPY packages/ ./packages/
COPY apps/notification-service/ ./apps/notification-service/

FROM base AS runtime
WORKDIR /app

COPY --from=deps /app/packages /app/packages
COPY --from=deps /app/node_modules /app/node_modules



# COPY --from=deps  /app/apps/api-gateway /app/apps/api-gateway



COPY --from=deps /app/apps/notification-service/node_modules /app/apps/notification-service/node_modules


WORKDIR /app/apps/notification-service
CMD ["pnpm", "start"]