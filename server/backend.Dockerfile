# backend/Dockerfile

# Stage 1: build
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: run
FROM eclipse-temurin:17-jdk-jammy
# Install Docker CLI so backend can run docker commands via ProcessBuilder
RUN apt-get update && apt-get install -y docker.io && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/target/leetcode-battle-backend-1.0.0.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]