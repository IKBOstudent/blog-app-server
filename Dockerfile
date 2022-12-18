FROM node:18-alpine

WORKDIR /usr/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

ENV PORT 10000
ENV MEDIA_PATH /usr/app/uploads

EXPOSE ${PORT}
CMD [ "node", "index.js" ]