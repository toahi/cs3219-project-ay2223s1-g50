# Arguments for env variables
ARG DB_QUESTIONS_CLOUD_URI

# Base image
FROM node:16

# Working directory
WORKDIR /usr/src/app

# Copy package json for dependencies
COPY package*.json ./

# Install prod dependencies
RUN npm ci --only=production

# Copy everything to container
COPY . .

# Env variables
ENV DB_QUESTIONS_CLOUD_URI=$DB_QUESTIONS_CLOUD_URI

EXPOSE 8090
CMD [ "node", "index.js" ]
