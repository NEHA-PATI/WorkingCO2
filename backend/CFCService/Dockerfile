FROM node:20-alpine

WORKDIR /app

ENV PORT=8004

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 8004

CMD ["node", "server.js"]
