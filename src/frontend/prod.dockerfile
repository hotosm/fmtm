FROM docker.io/node:18 as builder

ARG FMTM_DOMAIN
ARG VITE_API_URL
ENV VITE_API_URL="${VITE_API_URL:-api.${FMTM_DOMAIN}}"

WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml ./
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm install

ENV NODE_ENV production
COPY . .
RUN pnpm run build


FROM docker.io/devforth/spa-to-http:1.0.3 as prod
ARG APP_VERSION
ARG COMMIT_REF
ARG FMTM_DOMAIN
ARG VITE_API_URL
LABEL org.hotosm.fmtm.app-name="frontend" \
      org.hotosm.fmtm.app-version="${APP_VERSION}" \
      org.hotosm.fmtm.git-commit-ref="${COMMIT_REF:-none}" \
      org.hotosm.fmtm.maintainer="sysadmin@hotosm.org" \
      org.hotosm.fmtm.api-url="${VITE_API_URL:-api.${FMTM_DOMAIN}}"
WORKDIR /app
# Add non-root user, permissions
RUN adduser -D -u 900 -h /home/appuser appuser
USER appuser
COPY --from=builder --chown=appuser:appuser /app/dist .
