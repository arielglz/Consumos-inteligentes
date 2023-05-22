#First stage
FROM node:16 as builder
WORKDIR /app
COPY ../../frontend/package.json .
COPY ../../frontend/package-lock.json .
COPY ../../frontend/public/* .
RUN npm install
COPY . .
RUN npm run build

#Second stage
FROM nginx:latest
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]