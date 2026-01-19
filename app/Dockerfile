FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

# Add PM2 (runtime) for clustering
RUN npm i -g pm2

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

# Spawn workers (one per CPU core). Use a number instead of "max" if you prefer.
CMD ["pm2-runtime", "./dist/server/entry.mjs", "--name", "astro", "--instances", "max", "--exec-mode", "cluster"]
