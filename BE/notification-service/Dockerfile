FROM openjdk:17-jdk-slim
WORKDIR /app
# Sao chép file .jar đã build sẵn
COPY target/notification-service-0.0.1-SNAPSHOT.jar /app/notification-service.jar
# Expose port 8761
EXPOSE 8762
# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "/app/notification-service.jar"]