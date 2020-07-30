# docker run --name mp3_dl -p 9988:9988 -v $(pwd):/app/mp3/ -d --rm mp3_dl

FROM node:12-stretch-slim

RUN apt update && \ 
    apt-get -y install wget && \
    wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl && \
    chmod a+rx /usr/local/bin/youtube-dl && \
    apt-get -y install ffmpeg && \
    apt-get -y install python && \
    apt-get clean && \
    apt-get autoclean

WORKDIR /app

COPY package*.json ./

RUN npm i

RUN npm i -g pm2

COPY . .

EXPOSE 9988

CMD ["pm2-runtime", "app.js"]
