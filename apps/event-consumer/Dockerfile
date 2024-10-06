# Use Node.js 18 Alpine as the base image
FROM node:18-alpine AS base

# Install libc6-compat for compatibility with certain libraries
RUN apk update && apk add --no-cache libc6-compat

# Set the working directory
WORKDIR /app

# Prepare the builder stage
FROM base AS builder

# Install dependencies globally needed for the build (if any)
RUN npm install -g turbo

# Copy the entire project to the container
COPY . .

# Prune unnecessary files for the web project
RUN turbo prune --docker

# Install dependencies
FROM base AS installer

WORKDIR /app

# Copy the pruned package.json and package-lock.json files to install dependencies
COPY --from=builder /app/out/json/ .

# Install project dependencies based on the lockfile
RUN npm install

# Copy the rest of the pruned files to the container
COPY --from=builder /app/out/full/ .

# Build the NestJS project
RUN npm run build

# Prepare the final runner image
FROM base AS runner

WORKDIR /app

# Don't run production as root for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copy the build output from the installer stage
COPY --from=installer --chown=nestjs:nodejs /app/dist ./dist

# Copy any other necessary files such as public assets or environment files
COPY --from=installer /app/public ./public
COPY --from=installer /app/.env ./  

# Expose the NestJS app port
EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
