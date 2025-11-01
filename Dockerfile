###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine AS development

# Set WORKDIR untuk aplikasi
WORKDIR /usr/src/app

# Copy env file
COPY .env .env

# Salin file package.json dan package-lock.json
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci

# Salin seluruh kode sumber
COPY --chown=node:node . .

# Gunakan user "node"
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine AS build

# Set WORKDIR
WORKDIR /usr/src/app

# Copy env file
COPY .env .env

# Salin file package.json dan package-lock.json
COPY --chown=node:node package*.json ./

# Salin node_modules dari stage development
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# Salin semua source code
COPY --chown=node:node . .

# Jalankan build
RUN npm run build

# Set environment variable untuk production
ENV NODE_ENV=production

# Install hanya dependencies production
RUN npm ci --only=production && npm cache clean --force

# Gunakan user "node"
USER node

###################
# PRODUCTION
###################

FROM node:18-alpine AS production

# Set WORKDIR
WORKDIR /usr/src/app

# Copy env file
COPY .env .env

# Salin hasil build dan dependencies dari stage build
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Set the environment variable for port
ENV PORT 8080

# Expose port 3000 untuk aplikasi
EXPOSE 8080

# Jalankan aplikasi
CMD ["node", "dist/main.js"]
