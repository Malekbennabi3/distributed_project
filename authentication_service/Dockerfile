FROM node:latest
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

ARG MONGO_URL
ARG JWT_KEY

EXPOSE 8080
ENV PORT=8080
CMD ["node", "main.js"]
