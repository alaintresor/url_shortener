# Use Node.js LTS version with Debian
FROM node:20-slim

# Install necessary tools and build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ netcat-traditional && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript files
RUN npm run build

# Make the entrypoint script executable
RUN chmod +x docker-entrypoint.sh

# Expose the port the app runs on
EXPOSE 3001

# Set the entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]

# Command to run the application
CMD ["npm", "start"] 