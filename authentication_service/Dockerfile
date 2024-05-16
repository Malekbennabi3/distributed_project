FROM node:latest
WORKDIR /usr/app
COPY ./authentication_service /usr/app
COPY ./common /usr/app/common
RUN npm install

ARG MONGO_PASSWORD
ARG MONGO_PASSWORD_FILE
ARG JWT_KEY
ARG JWT_KEY_FILE

EXPOSE 8080
ENV PORT=8080
CMD ["node", "main.js"]
