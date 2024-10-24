# Stage 1: Install dependencies
FROM node:18-alpine AS deps

WORKDIR /app

# Copy dependency files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Stage 2: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy all files
COPY . .

# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Declare build-time arguments
ARG NEXT_PUBLIC_DOCS
ARG NEXT_PUBLIC_EXIT_URL
ARG NEXT_PUBLIC_DOUBLE_LOGIN
ARG NEXT_PUBLIC_DOUBLE_EMAIL_LOGIN
ARG NEXT_PUBLIC_OTP
ARG NEXT_PUBLIC_PROGRESS
ARG NEXT_PUBLIC_BUSINESS_PAGE
ARG NEXT_PUBLIC_DOUBLE_OTP

# Set environment variables for build time
ENV NEXT_PUBLIC_DOCS=$NEXT_PUBLIC_DOCS
ENV NEXT_PUBLIC_EXIT_URL=$NEXT_PUBLIC_EXIT_URL
ENV NEXT_PUBLIC_DOUBLE_LOGIN=$NEXT_PUBLIC_DOUBLE_LOGIN
ENV NEXT_PUBLIC_DOUBLE_EMAIL_LOGIN=$NEXT_PUBLIC_DOUBLE_EMAIL_LOGIN
ENV NEXT_PUBLIC_OTP=$NEXT_PUBLIC_OTP
ENV NEXT_PUBLIC_PROGRESS=$NEXT_PUBLIC_PROGRESS
ENV NEXT_PUBLIC_BUSINESS_PAGE=$NEXT_PUBLIC_BUSINESS_PAGE
ENV NEXT_PUBLIC_DOUBLE_OTP=$NEXT_PUBLIC_DOUBLE_OTP

# Build the app
RUN yarn build

# Stage 3: Set up the production environment
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

# Set runtime environment variables
ENV NEXT_PUBLIC_DOCS=$NEXT_PUBLIC_DOCS
ENV NEXT_PUBLIC_EXIT_URL=$NEXT_PUBLIC_EXIT_URL
ENV NEXT_PUBLIC_DOUBLE_LOGIN=$NEXT_PUBLIC_DOUBLE_LOGIN
ENV NEXT_PUBLIC_DOUBLE_EMAIL_LOGIN=$NEXT_PUBLIC_DOUBLE_EMAIL_LOGIN
ENV NEXT_PUBLIC_OTP=$NEXT_PUBLIC_OTP
ENV NEXT_PUBLIC_PROGRESS=$NEXT_PUBLIC_PROGRESS
ENV NEXT_PUBLIC_BUSINESS_PAGE=$NEXT_PUBLIC_BUSINESS_PAGE
ENV NEXT_PUBLIC_DOUBLE_OTP=$NEXT_PUBLIC_DOUBLE_OTP

# Copy necessary files from the builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Expose the port
EXPOSE 3000

# Start the Next.js app
CMD ["yarn", "start"]
