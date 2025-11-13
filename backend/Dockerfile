# Etapa 1: build de la app con Gradle
FROM gradle:8.10.2-jdk17 AS build
WORKDIR /app

# Copiamos todo el proyecto del backend (este Dockerfile está en /backend)
COPY . .

# Construimos el JAR de Spring Boot
RUN ./gradlew clean bootJar --no-daemon

# Etapa 2: imagen ligera de runtime
FROM eclipse-temurin:17-jre AS runtime
WORKDIR /app

# Copiamos el JAR generado en la etapa de build
COPY --from=build /app/build/libs/*-SNAPSHOT.jar app.jar

# Perfil por defecto dentro del contenedor (luego lo sobreescribimos por env)
ENV SPRING_PROFILES_ACTIVE=gcp

# Exponemos el puerto de la app
EXPOSE 8080

# Comando de arranque
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
