# Multi-stage Docker build for Spring Boot backend
# Developer: Manzi Niyongira Osee
# Year: 2025

# Build stage
FROM gradle:8.5-jdk17 AS build

WORKDIR /app

# Copy gradle files
COPY build.gradle.kts settings.gradle.kts ./
COPY gradle gradle

# Download dependencies
RUN gradle dependencies --no-daemon

# Copy source code
COPY src src

# Build application
RUN gradle build --no-daemon -x test

# Runtime stage
FROM openjdk:17-jre-slim

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy built jar
COPY --from=build /app/build/libs/*.jar app.jar

# Change ownership
RUN chown appuser:appuser app.jar

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Environment variables
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
