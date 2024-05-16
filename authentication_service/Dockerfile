FROM node:latest
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

ARG MONGO_URL
ARG PRIVATE_KEY_PATH
ARG PUBLIC_KEY_PATH
ARG PORT=8080

EXPOSE 8080
CMD ["node", "main.js"]
