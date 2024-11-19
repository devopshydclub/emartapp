FROM maven:3.8.6-openjdk-8-slim AS BUILD_IMAGE

WORKDIR /usr/src/app/

COPY ./ /usr/src/app/

# Build the application, skipping tests
RUN mvn install -DskipTests

FROM openjdk:8-jdk-slim
WORKDIR /usr/src/app/

# Copy the built JAR from the previous stage
COPY --from=BUILD_IMAGE /usr/src/app/target/book-work-0.0.1-SNAPSHOT.jar ./book-work-0.0.1.jar

# Expose the application port
EXPOSE 9000

# Set the entry point to run the application
ENTRYPOINT ["java", "-jar", "book-work-0.0.1.jar"]
