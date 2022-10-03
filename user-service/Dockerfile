# Arg for env variables 
ARG DB_USERS_CLOUD_URI
ARG REDIS_USERS_CLOUD_URI
ARG JWT_ACCESS_TOKEN_SECRET
ARG JWT_REFRESH_TOKEN_SECRET

# Base image
FROM node:16

# Working directory 
WORKDIR /usr/src/app

# Copy package json for dependencies
COPY package*.json ./

# Install prod dependencies
RUN npm ci --omit=dev

# Copy everything to container
COPY . .

# Env variables
ENV DB_USERS_CLOUD_URI=$DB_USERS_CLOUD_URI
ENV REDIS_USERS_CLOUD_URI=$REDIS_USERS_CLOUD_URI
ENV JWT_ACCESS_TOKEN_SECRET=$JWT_ACCESS_TOKEN_SECRET
ENV JWT_REFRESH_TOKEN_SECRET=$JWT_REFRESH_TOKEN_SECRET

EXPOSE 8080
CMD [ "node", "index.js" ]
