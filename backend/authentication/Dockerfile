# Use Node.js LTS (Long Term Support) version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose the port (Note: actual port depends on environment variable PORT)
EXPOSE 5002

# Start the application
CMD ["npm", "start"]
