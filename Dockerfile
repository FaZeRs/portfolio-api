FROM node:18-alpine As development

WORKDIR /usr/src/app

RUN corepack enable

COPY --chown=node:node .npmrc package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm install --frozen-lockfile

COPY --chown=node:node . .

USER node

FROM node:18-alpine As build

WORKDIR /usr/src/app

RUN corepack enable

COPY --chown=node:node package.json pnpm-lock.yaml ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

ARG APP_ENV=production
ENV NODE_ENV=${APP_ENV}

RUN pnpm build

USER node

FROM node:18-alpine

ARG APP_ENV=production
ENV NODE_ENV=${APP_ENV}

COPY --chown=node:node package.json pnpm-lock.yaml ./
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "node" , "dist/src/main.js" ]
