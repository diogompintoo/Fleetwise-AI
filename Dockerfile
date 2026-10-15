# =====  1: Build frontend =====
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# =====  2: Build backend =====
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-build
WORKDIR /app
COPY pom.xml .
COPY src ./src

# Copy the browser build and rename index.csr.html → index.html
COPY --from=frontend-build /app/frontend/dist/frontend/browser ./src/main/resources/static
RUN cp src/main/resources/static/index.csr.html src/main/resources/static/index.html

RUN mvn -q -DskipTests package


# =====  3: Runtime =====
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]