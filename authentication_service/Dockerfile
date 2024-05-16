FROM node:latest
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

ARG MONGO_URL_FILE
ARG JWT_KEY_FILE

EXPOSE 8080
ENV PORT=8080
CMD ["node", "main.js"]
