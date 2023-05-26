FROM node:alpine
WORKDIR /src
COPY . .
# RUN ls -lhtr / && ls -lhtr /src && sleep 30s
RUN npm install
CMD [ "node", "/src/index.js" ]
EXPOSE 4000