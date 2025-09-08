# Multi-stage Docker build for Spring Boot backend
# Developer: Manzi Niyongira Osee
# Year: 2025

# Build stage
FROM gradle:8.5-jdk21 AS build

WORKDIR /app
COPY . .
RUN ./gradlew build -x test --no-daemon

# Copy source code
COPY src src

# Build application
RUN gradle build --no-daemon -x test

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Install curl for health checks (Alpine)
RUN apk add --no-cache curl

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
  CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# Environment variables
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
