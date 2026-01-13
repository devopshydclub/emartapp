FROM eclipse-temurin:8-jdk AS build_image



WORKDIR /usr/src/app/

RUN apt-get update && apt-get install -y maven



COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:8-jre

WORKDIR /usr/src/app/

COPY --from=build_image /usr/src/app/target/book-work-0.0.1-SNAPSHOT.jar book-work-0.0.1.jar



EXPOSE 9000

ENTRYPOINT ["java","-jar","book-work-0.0.1.jar"]
