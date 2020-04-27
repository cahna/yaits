# Build
FROM node:alpine as builder
WORKDIR /app
RUN apk add build-base libtool autoconf automake zlib-dev
COPY . /app
RUN npm install
RUN npm run build

# Serve
FROM nginx:alpine
COPY --from=builder /app/app/.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 5001
CMD ["nginx", "-g", "daemon off;"]
