# Dockerfile for Node + Prisma + Postgres
FROM node:18

WORKDIR /usr/src/app

# Install system deps (if any)
RUN apt-get update && apt-get install -y build-essential openssl ca-certificates

COPY package.json package-lock.json* ./
RUN npm install --production

# Copy app
COPY . .

# Generate Prisma client (after copying schema)
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "start"]
