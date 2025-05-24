package com.a2m.profileservice.exception;

import com.a2m.profileservice.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Xử lý lỗi tùy chỉnh (AppException)
    @ExceptionHandler(AppException.class)
    public <T> ResponseEntity<ApiResponse<T>> handleAppException(AppException ex) {
        logger.error("AppException occurred: {}", ex.getMessage(), ex);  // Log lỗi chi tiết
        ErrorCode errorCode = ex.getErrorCode();
        ApiResponse<T> apiResponse = ApiResponse.<T>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return new ResponseEntity<>(apiResponse, errorCode.getStatus());
    }

    // Xử lý lỗi không tìm thấy đối tượng (EntityNotFoundException)
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleEntityNotFoundException(EntityNotFoundException ex) {
        logger.error("EntityNotFoundException occurred: {}", ex.getMessage(), ex);  // Log lỗi chi tiết
        ApiResponse<Object> apiResponse = ApiResponse.<Object>builder()
                .code(ErrorCode.USER_NOT_FOUND.getCode())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
    }

    // Xử lý lỗi dữ liệu không hợp lệ (IllegalArgumentException)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        logger.error("IllegalArgumentException occurred: {}", ex.getMessage(), ex);  // Log lỗi chi tiết
        ApiResponse<Object> apiResponse = ApiResponse.<Object>builder()
                .code(ErrorCode.VALIDATION_ERROR.getCode())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    // Xử lý lỗi hệ thống chung
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(Exception ex) {
        logger.error("Exception occurred: {}", ex.getMessage(), ex);  // Log lỗi chi tiết
        ApiResponse<Object> apiResponse = ApiResponse.<Object>builder()
                .code(ErrorCode.INTERNAL_ERROR.getCode())
                .message("Internal server error")
                .build();
        return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
