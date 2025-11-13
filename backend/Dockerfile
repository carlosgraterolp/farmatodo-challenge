# ---- Build stage ----
    FROM eclipse-temurin:17-jdk-alpine AS builder

    WORKDIR /workspace
    
    # Copia wrapper y archivos de gradle primero (mejor cache)
    COPY gradlew /workspace/gradlew
    COPY gradle /workspace/gradle
    COPY settings.gradle /workspace/settings.gradle
    COPY build.gradle /workspace/build.gradle
    
    # Da permiso de ejecución al wrapper
    RUN chmod +x /workspace/gradlew
    
    # Descarga dependencias (se cachea mientras no cambie build.gradle)
    RUN ./gradlew --no-daemon dependencies || true
    
    # Copia el código fuente
    COPY src /workspace/src
    
    # Construye el JAR "fat" (sin tests para rapidez aquí)
    RUN ./gradlew --no-daemon clean bootJar -x test
    
    # ---- Run stage ----
    FROM eclipse-temurin:17-jre-alpine
    
    # Usuario no-root
    RUN addgroup -S spring && adduser -S spring -G spring
    USER spring:spring
    
    WORKDIR /app
    
    # Copia el jar construido
    COPY --from=builder /workspace/build/libs/*.jar /app/app.jar
    
    EXPOSE 8080
    
    # Variables vía docker-compose (abajo)
    ENV JAVA_OPTS=""
    
    ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
    