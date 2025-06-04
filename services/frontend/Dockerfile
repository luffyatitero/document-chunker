FROM node:22-alpine AS build

WORKDIR /app

COPY services/frontend/package*.json ./

RUN npm config set registry https://registry.npmjs.org/
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY services/frontend .