FROM node:20-alpine AS build

WORKDIR /app

COPY services/frontend/package*.json ./

RUN npm install

COPY services/frontend .