FROM node:20-alpine AS base

WORKDIR /app

COPY . .

RUN npm install -g turbo
RUN npm install --force

FROM base AS build

RUN npm run build


FROM node:20-alpine AS production

WORKDIR /app


COPY --from=build /app .

EXPOSE 3000

CMD ["npm","run", "start"]