# Use a supported OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jdk-jammy

# Set the working directory
WORKDIR /app

# Copy the built jar file
COPY target/masterdocs-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
