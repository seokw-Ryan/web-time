# Use the official Node.js image.
FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Set the environment variable to address the OpenSSL issue.
ENV NODE_OPTIONS=--openssl-legacy-provider

# Expose the application port
EXPOSE 3000

# Run the web service on container startup.
CMD ["npm", "start"]
