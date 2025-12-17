FROM node:20-slim

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build Next.js
RUN npm run build

# Create data directory for SQLite
RUN mkdir -p /app/prisma/data

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
