FROM node:18-alpine

WORKDIR /app

# Install Backend Dependencies
COPY package*.json ./
RUN npm install

# Setup Client
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy Source
COPY . .

# Build Client
RUN cd client && npm run build

# Environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
