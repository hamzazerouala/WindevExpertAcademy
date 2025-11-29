# Use Node.js 20 Debian-based image to satisfy Prisma OpenSSL requirements
FROM node:20-bullseye-slim

# Install FFmpeg and OpenSSL
RUN apt-get update && apt-get install -y ffmpeg openssl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Remove dev dependencies for production runtime
RUN npm prune --omit=dev

# Copy source code
COPY . .

# Start the worker
ENV NODE_ENV=production
ENV STORAGE_PATH=/app/storage
VOLUME /app/storage
CMD ["npm", "start"]
