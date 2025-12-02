FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/* \
  && npm install --legacy-peer-deps

COPY prisma ./prisma/

RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3001
ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]
