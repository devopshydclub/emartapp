FROM eclipse-temurin:8-jdk AS build
WORKDIR /app

COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:8-jdk
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 9000
ENTRYPOINT ["java","-jar","app.jar"]
