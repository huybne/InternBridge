FROM openjdk:17-jdk-slim
WORKDIR /app
# Sao chép file .jar đã build sẵn
COPY target/api-gateway-0.0.1-SNAPSHOT.jar /app/api-gateway.jar
# Expose port 8761
EXPOSE 8762
# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "/app/api-gateway.jar"]