# Stage 1: Base image
FROM node:18-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Stage 2: Builder (for pruning unnecessary files)
FROM base AS builder
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=server --docker

# Stage 3: Installer (to install dependencies)
FROM base AS installer
WORKDIR /app

# Copy only the necessary package.json and package-lock.json for installing dependencies
COPY --from=builder /app/out/json/ ./

# Install dependencies
RUN npm install --force

# Copy the full project including source files from the builder stage
COPY --from=builder /app/out/full/ ./

# Build the project (NestJS build command)
RUN npm run build

# Stage 4: Runner (minimal image to run the application)
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Use the non-root user
USER nestjs

# Copy the built application from the installer stage
COPY --from=installer --chown=nestjs:nodejs /app/apps/server/ ./

# Expose the application port
EXPOSE 8080

# Start the application in production mode
CMD ["npm", "run", "prod"]
