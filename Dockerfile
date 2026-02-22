FROM node:20

WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy everything else including tsconfig
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript
RUN npx tsc

EXPOSE 3000

# Run the compiled server
CMD ["node", "dist/server.js"]