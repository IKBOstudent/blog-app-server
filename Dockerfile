FROM node:16-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

RUN npm run build

ENV PORT 10000

EXPOSE ${PORT}
CMD [ "node", "dist/index.js" ]