# docker run --name mp3_dl -p 9988:9988 -v $(pwd):/app/mp3/ -d mp3_dl

FROM node:12-stretch-slim

RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
RUN chmod a+rx /usr/local/bin/youtube-dl

WORKDIR /app

COPY package*.json ./

RUN npm i

RUN npm i -g pm2

COPY . .

EXPOSE 9988

CMD ["pm2-runtime", "app.js"]
