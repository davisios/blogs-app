# Base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY package.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy the .env and .env.development files

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 5000

# Start the server using the production build
CMD ["npm", "run", "start:dev"]