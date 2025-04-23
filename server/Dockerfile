# Stage 1: Build the TypeScript app
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build  # should generate /app/dist

# Stage 2: Run the app
FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]
