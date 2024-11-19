FROM node:14-alpine AS web-build

WORKDIR /usr/src/app/client

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:alpine-slim

COPY --from=web-build /usr/src/app/client/dist/client/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200