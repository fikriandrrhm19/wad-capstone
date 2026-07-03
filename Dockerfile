FROM node:26.4.0-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --only=production

RUN npx prisma generate

COPY src ./src

FROM alpine:3.23.5

RUN apk add --no-cache \
    nodejs \
    npm \
    openssl \
    libgcc \
    libstdc++

RUN addgroup -S nodegroup && adduser -S -D -h /app -G nodegroup nodeuser

WORKDIR /app

COPY --from=builder --chown=nodeuser:nodegroup /app /app

USER nodeuser

EXPOSE 3000

ENV NODE_ENV=production

ENTRYPOINT ["sh", "-c", "npx prisma db push && node src/index.js"]