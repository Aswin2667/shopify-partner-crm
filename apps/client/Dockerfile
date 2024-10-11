# to docker hub
FROM node:18-alpine AS base
FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo --ignore-engines
COPY ../../ .
RUN turbo prune --scope=client --docker
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN npm install --force
COPY --from=builder /app/out/full/ .
RUN npm run build --filter=client...
FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 viteuser
USER viteuser
COPY --from=installer --chown=viteuser:nodejs /app/apps/client/dist ./dist
CMD npx serve -s dist