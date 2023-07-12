# multi-stage build
FROM node:18-alpine as build
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt
COPY . /opt/build

# build azure blob plugin
WORKDIR /opt/build
RUN ["yarn", "install"]
RUN ["yarn", "build-plugins"]
RUN ["yarn", "build"]

# create production image
FROM node:18-alpine
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_CLIENT=sqlite
ENV DATABASE_FILENAME=data/data.db

WORKDIR /opt
COPY --chown=node:node --from=build /opt/build app
WORKDIR /opt/app
# attach sqlite volume
VOLUME /opt/app/data

USER node

EXPOSE 1337
CMD ["yarn", "start"]