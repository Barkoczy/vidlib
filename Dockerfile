FROM node:latest

LABEL Henrich Barkoczy <me@barkoczy.social>

ARG user
ARG uid

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --save

COPY . .

USER $user

EXPOSE ${SERVER_PORT}

CMD ["npm", "start"]