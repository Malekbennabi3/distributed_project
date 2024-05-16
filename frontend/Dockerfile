FROM node:latest
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install serve

ARG THIS_URL

EXPOSE 80
CMD ["npx", "serve", "-l", "80", "site"]
