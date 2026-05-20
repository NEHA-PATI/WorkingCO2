# ---- Base Image ----
FROM node:18-alpine

# ---- App Directory ----
WORKDIR /app

# ---- Install Dependencies ----
COPY package*.json ./
RUN npm install --production

# ---- Copy Source Code ----
COPY . .

# ---- Expose Port ----
EXPOSE 5008

# ---- Start App ----
CMD ["node", "server.js"]