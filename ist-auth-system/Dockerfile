# Multi-stage build for Spring Boot
FROM gradle:8.5-jdk17 AS build

WORKDIR /app
COPY . .
RUN ./gradlew build -x test --no-daemon

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=build /app/build/libs/ist-auth-system-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 10000

CMD ["java", "-Dserver.port=${PORT:-10000}", "-jar", "app.jar"]