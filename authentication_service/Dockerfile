FROM node:latest
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

ARG MONGO_URL
ARG PORT=8080
ARG JWT_KEY

EXPOSE 8080
CMD ["node", "main.js"]
