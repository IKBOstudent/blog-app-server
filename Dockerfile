FROM node:18-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

ENV PORT 10000

EXPOSE ${PORT}
CMD [ "node", "index.js" ]