# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm i; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG PINECONE_API_KEY
ARG PINECONE_INDEX
ARG RIPESEED_OPENAI_API_KEY
ARG RIPESEED_DOC_INDEX_ID
ARG MONGO_CONNECTION_STRING
ARG MOMENTO_API_KEY
ARG OPENAI_API_KEY
ARG NEXT_PUBLIC_CALENDLY

ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV PINECONE_API_KEY=$PINECONE_API_KEY
ENV PINECONE_INDEX=$PINECONE_INDEX
ENV RIPESEED_OPENAI_API_KEY=$RIPESEED_OPENAI_API_KEY
ENV RIPESEED_DOC_INDEX_ID=$RIPESEED_DOC_INDEX_ID
ENV MONGO_CONNECTION_STRING=$MONGO_CONNECTION_STRING
ENV MOMENTO_API_KEY=$MOMENTO_API_KEY
ENV NEXT_PUBLIC_CALENDLY=$NEXT_PUBLIC_CALENDLY

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]