# Dockerfile (copier à la racine du repo)
FROM node:18

WORKDIR /usr/src/app

# Copy package files first for caching
COPY package.json package-lock.json* ./

# Install dependencies (including prisma for build time)
RUN npm install --production=false

# Copy prisma schema first to ensure availability
COPY prisma ./prisma

# Copy rest of app
COPY . .

# Optional debug: list files (décommenter si besoin)
# RUN ls -la /usr/src/app && ls -la /usr/src/app/prisma

# Generate Prisma client explicitly pointing to schema
RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3000
CMD ["npm", "start"]
