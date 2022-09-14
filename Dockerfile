FROM node:16.17.0 AS builder
WORKDIR /app
COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build

FROM nginx:alpine as production

COPY --from=builder /app/dist/. /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
