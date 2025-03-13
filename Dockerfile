# Usar una versión de Node.js que sea compatible con Next.js
FROM node:18-alpine

# Instalar dependencias globales necesarias
RUN apk add --no-cache libc6-compat python3 make g++ openssl

# Establecer directorio de trabajo
WORKDIR /app

# Instalar Prisma CLI globalmente
RUN npm install -g prisma

# Copiar package.json y package-lock.json
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci

# Copiar configuración de Next.js (con la extensión correcta)
COPY next.config.ts ./
COPY tsconfig.json ./
COPY jsconfig.json* ./

# Copiar archivos de Prisma
COPY prisma ./prisma/

# Generar Prisma Client
RUN npx prisma generate

# Copiar el resto de los archivos (excepto los que están en .dockerignore)
COPY . .

# Exponer el puerto donde se ejecutará Next.js
EXPOSE 3000

# Variables de entorno específicas para Next.js
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV development

# Comando para iniciar Next.js en modo desarrollo con soporte para Fast Refresh
CMD ["npm", "run", "dev"]