# Stage 1: Build React app
FROM node:18-alpine AS build

WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Копируем весь проект и выполняем сборку
COPY . .
RUN npm run build

# Stage 2: Запуск через Nginx
FROM nginx:stable-alpine

# Удаляем стандартные файлы Nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем скомпилированные файлы React из предыдущего этапа
COPY --from=build /app/build /usr/share/nginx/html

# Копируем кастомный конфигурационный файл Nginx для проксирования API
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
