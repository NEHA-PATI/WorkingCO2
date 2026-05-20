# ==================== BASE IMAGE ====================
FROM node:20-alpine

# ==================== WORKDIR ====================
WORKDIR /app

# ==================== COPY PACKAGE FILES ====================
COPY package*.json ./

# ==================== INSTALL DEPENDENCIES ====================
# 🔥 Only production deps (lightweight)
RUN npm install --omit=dev

# ==================== COPY SOURCE CODE ====================
COPY . .

# ==================== EXPOSE PORT ====================
EXPOSE 5001

# ==================== START APP ====================
CMD ["node", "src/server.js"]