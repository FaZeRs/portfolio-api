FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

ARG APP_ENV=production
ENV NODE_ENV=${APP_ENV}

RUN npm run build

RUN npm prune

FROM node:18-alpine

ARG APP_ENV=production
ENV NODE_ENV=${APP_ENV}

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

USER node
CMD [ "npm", "run", "start:prod" ]