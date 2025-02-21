# syntax=docker/dockerfile:1

##############################
# Этап сборки приложения
##############################
FROM gradle:7.6.0-jdk17 AS builder
WORKDIR /app
COPY --chown=gradle:gradle . .

# Выводим содержимое корневой директории для диагностики
RUN ls -la /app
RUN ls -la /app/server

# Переходим в каталог server и используем gradlew, если он есть
WORKDIR /app/server
RUN chmod +x gradlew
RUN ./gradlew clean build --no-daemon

##############################
# Этап выполнения приложения
##############################
FROM openjdk:17-jdk-slim
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/server/build/libs/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
