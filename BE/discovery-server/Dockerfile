FROM openjdk:17-jdk-slim
WORKDIR /app
# Sao chép file .jar đã build sẵn
COPY target/discovery-server-0.0.1-SNAPSHOT.jar /app/discovery-server.jar
# Expose port 8761
EXPOSE 8761
# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "/app/discovery-server.jar"]