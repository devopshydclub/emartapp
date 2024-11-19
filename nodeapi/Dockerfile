FROM node:14-alpine AS nodeapi-build

WORKDIR /usr/src/app/nodeapi

COPY package.json package-lock.json ./

RUN npm install

FROM node:14-alpine

WORKDIR /usr/src/app

COPY --from=nodeapi-build /usr/src/app/nodeapi/node_modules ./node_modules

COPY . .

EXPOSE 5000

CMD ["npm", "start"]