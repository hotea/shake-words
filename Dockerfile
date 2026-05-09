# =============================================================
# ShakeWords — Dockerfile (Node.js SSR)
# =============================================================

FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_BACKEND_TYPE=mysql
ARG NEXT_PUBLIC_SUPABASE_URL=""
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=""
ARG NEXT_BASE_PATH=""

ENV NEXT_PUBLIC_BACKEND_TYPE=${NEXT_PUBLIC_BACKEND_TYPE}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_BASE_PATH=${NEXT_BASE_PATH}
ENV NEXT_PUBLIC_BASE_PATH=${NEXT_BASE_PATH}

RUN npm run build

FROM node:20-alpine AS server
WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
