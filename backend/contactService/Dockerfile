# 1️⃣ Base Image
FROM node:20-alpine

# 2️⃣ Set Working Directory
WORKDIR /app

# 3️⃣ Copy package files first (better caching)
COPY package*.json ./

# 4️⃣ Install only production dependencies
RUN npm install --omit=dev

# 5️⃣ Copy rest of application code
COPY . .

# 6️⃣ Expose app port
EXPOSE 5005

# 7️⃣ Start application
CMD ["node", "server.js"]
