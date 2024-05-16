FROM node:latest
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

ARG MONGO_URL_FILE
ARG AUTH_URL

EXPOSE 8081
ENV PORT=8081
CMD ["node", "main.js"]
