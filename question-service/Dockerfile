# Base image
FROM node:16

# Arguments for env variables
ARG DB_QUESTIONS_CLOUD_URI

# Env variables
ENV DB_QUESTIONS_CLOUD_URI $DB_QUESTIONS_CLOUD_URI

# Working directory
WORKDIR /usr/src/app

# Copy package json for dependencies
COPY package*.json ./

# Install prod dependencies
RUN npm ci
# RUN npm ci --omit=dev

# Copy everything to container
COPY . .

EXPOSE 8090
# command below to be updated
CMD ["npm", "run", "dev"]
# CMD [ "node", "index.js" ]
