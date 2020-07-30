FROM node:12-stretch

RUN sudo curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
RUN sudo chmod a+rx /usr/local/bin/youtube-dl

WORKDIR /app

COPY package*.json ./

RUN npm i

RUN npm i -g pm2

COPY . .

EXPOSE 3030

CMD ["pm2-runtime", "app.js"]