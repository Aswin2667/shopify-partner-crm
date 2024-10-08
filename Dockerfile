FROM node:20-alpine AS base

WORKDIR /app

COPY ./package.json ./turbo.json ./
COPY ./apps ./apps
COPY ./packages ./packages

RUN npm install -g turbo
RUN npm install --force

FROM base AS build

RUN npm run build


FROM node:20-alpine AS production

WORKDIR /app


COPY --from=build /app .

EXPOSE 3000 8080 8081 8082 9090

CMD ["sh", "-c", "npm run prod"]