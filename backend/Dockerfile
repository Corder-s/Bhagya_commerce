# -------------------------------------------------------------
# Bhagya Commerce — Production Spring Boot Backend Dockerfile
# Multi-stage build with OpenJDK 21 / Temurin
# -------------------------------------------------------------

# Stage 1: Build stage
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /workspace

# Copy POM and download dependencies for layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create unprivileged system user for security
RUN addgroup -S bhagya && adduser -S bhagya -G bhagya

# Copy jar from builder
COPY --from=builder /workspace/target/*.jar /app/app.jar

# Configuration environment defaults
ENV SERVER_PORT=8080 \
    SPRING_PROFILES_ACTIVE=dev \
    JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0"

USER bhagya

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health | grep UP || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
