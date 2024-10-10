# FROM node:18-alpine AS base
# RUN apk update && apk add --no-cache libc6-compat
# WORKDIR /app
# FROM base AS builder
# RUN npm install -g turbo
# COPY . .
# RUN turbo prune --scope=server --docker
# FROM base AS installer
# WORKDIR /app
# COPY --from=builder /app/out/full/ ./
# RUN npm install --force
# RUN npm run build
# FROM base AS runner
# WORKDIR /app
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nestjs
# USER nestjs
# COPY --from=installer --chown=nestjs:nodejs /app/ ./
# EXPOSE 8080
# CMD [ "node", "dist/src/main.js" ]

FROM aswin96777/crm-server:latest

WORKDIR /app

EXPOSE 8080

CMD [ "node", "dist/src/main.js" ]