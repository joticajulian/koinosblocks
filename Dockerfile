FROM node:16.17.0 AS builder
WORKDIR /app
COPY . .

RUN yarn install --frozen-lockfile

# default to mainnet
ARG CHAIN_ID=EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==
ARG GIT_COMMIT_HASH

ENV VITE_CHAIN_ID=${CHAIN_ID}
ENV VITE_GIT_COMMIT_HASH=${GIT_COMMIT_HASH}

RUN yarn build

FROM nginx:alpine as production

COPY --from=builder /app/dist/. /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
