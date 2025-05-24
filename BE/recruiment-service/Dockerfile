FROM openjdk:17-jdk-slim
WORKDIR /app
# Sao chép file .jar đã build sẵn
COPY target/recruitment_service-0.0.1-SNAPSHOT.jar /app/recruitment_service.jar
# Expose port 8761
EXPOSE 8762
# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "/app/recruitment_service.jar"]