#First stage
# FROM node:16-alpine as builder
# WORKDIR /app
# COPY ../../frontend/package.json .
# COPY ../../frontend/package-lock.json .
# COPY ../../frontend/public/* .
# # RUN npm install
# RUN npm ci
# COPY ../../frontend/ .
# # RUN ls -lhtr / && ls -lhtr /app && sleep 15s
# RUN npm run build

# #Second stage
# FROM nginx:latest
# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY --from=builder /app/build .
# COPY ../../frontend/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

FROM node:16-alpine
WORKDIR /app
COPY ../../frontend .

RUN npm ci
# RUN npm run build

EXPOSE 3500
# CMD [ "npx", "serve", "build" ]
CMD [ "npm", "run", "start" ]