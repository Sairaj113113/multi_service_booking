# ---------- STAGE 1 : BUILD ----------
    FROM maven:3.9.9-eclipse-temurin-17 AS build

    WORKDIR /app
    
    COPY pom.xml .
    RUN mvn -B -q -e -DskipTests dependency:go-offline
    
    COPY src ./src
    
    RUN mvn clean package -DskipTests
    
    
    # ---------- STAGE 2 : RUN ----------
    FROM eclipse-temurin:17-jdk-alpine
    
    WORKDIR /app
    
    COPY --from=build /app/target/*.jar app.jar
    
    EXPOSE 8080
    
    CMD ["sh", "-c", "java -jar app.jar --server.port=$PORT"]