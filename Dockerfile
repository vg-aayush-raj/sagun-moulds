# Stage 1: Build Stage
# Use the official Node.js image as the base image
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy necessary files for dependency installation
COPY . /app/

# Remove the existing node_modules directory
#RUN rm -rf node_modules

# Install dependencies using pnpm
RUN --mount=type=secret,id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN --mount=type=secret,id=HUGEICONS_AUTH_TOKEN,env=HUGEICONS_AUTH_TOKEN pnpm install --frozen-lockfile

# Pass environment variables to the build process
ARG ENVIRONMENT=dev

# Build the project
RUN pnpm build $ENVIRONMENT

# Stage 2: Serve Stage
# Use a lightweight Nginx image for serving the app
FROM nginx:stable-alpine AS serve

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the application
EXPOSE 80 

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]