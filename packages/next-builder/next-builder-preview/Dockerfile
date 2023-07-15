FROM node:18-alpine as build
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt
COPY . frontend

WORKDIR /opt/frontend
RUN ["yarn", "install"]
RUN ["yarn", "build"]

# create production image
FROM node:18-alpine
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app
COPY --from=build --chown=node:node /opt/frontend/.next/standalone ./
COPY --from=build --chown=node:node /opt/frontend/.next/static ./.next/static

USER node
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]