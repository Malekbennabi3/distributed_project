FROM node:latest
WORKDIR /usr/app
COPY ./backend /usr/app
COPY ./common /usr/app/common
RUN npm install

ARG MONGO_PASSWORD
ARG MONGO_PASSWORD_FILE
ARG AUTH_URL

EXPOSE 8081
ENV PORT=8081
CMD ["node", "main.js"]
