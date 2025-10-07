# Stage 1: Builder
FROM node:18 AS builder

WORKDIR /

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine

WORKDIR /

COPY --from=builder /package*.json ./
RUN npm install --omit=dev

COPY --from=builder /dist ./dist

EXPOSE 8000

CMD ["node", "dist/main"]
