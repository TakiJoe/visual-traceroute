FROM node:slim

EXPOSE 8080

RUN apt-get update && apt-get install -y traceroute && rm -rf /var/lib/apt/lists/*

COPY . /vt

WORKDIR /vt

RUN npm install

ENTRYPOINT ["node", "trace.js"]
