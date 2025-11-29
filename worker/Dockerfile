# Use Node.js 20 alpine as base image
FROM node:20-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with fallback if no lockfile is present
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev --legacy-peer-deps; fi

# Copy source code
COPY . .

# Start the worker
ENV NODE_ENV=production
ENV STORAGE_PATH=/app/storage
VOLUME /app/storage
CMD ["npm", "start"]
