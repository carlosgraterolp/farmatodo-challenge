# Etapa 1: instalar dependencias
FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Etapa 2: build de la app Next.js
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Aquí Next toma .env.production automáticamente para las NEXT_PUBLIC_*
RUN npm run build

# Etapa 3: runtime en producción
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiamos todo lo necesario desde el builder
COPY --from=builder /app ./

# Cloud Run exporta $PORT; usamos ese valor (o 3000 por defecto)
EXPOSE 3000
ENV PORT=3000

# Pasamos el puerto a next start
CMD ["sh", "-c", "npm run start -- -p ${PORT:-3000}"]
