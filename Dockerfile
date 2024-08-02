FROM node:20-alpine

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 3000 8081 8080

CMD [ "npm","run","dev"]