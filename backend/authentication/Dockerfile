# 1️⃣ Base image
FROM node:20-alpine

# 2️⃣ App directory
WORKDIR /app

# 3️⃣ Copy package files first (cache benefit)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install --production

# 5️⃣ Copy rest of code
COPY . .

# 6️⃣ Expose port
EXPOSE 5002

# 7️⃣ Start app
CMD ["node", "server.js"]
