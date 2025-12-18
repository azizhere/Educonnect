FROM node:18
# Dockerfile for Educonnect backend service
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
