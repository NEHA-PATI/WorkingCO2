# Use Node.js LTS (Long Term Support) version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
# using npm ci for cleaner, deterministic installs in CI/CD/Docker environments
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose the default port (can be overridden by environment variable)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
