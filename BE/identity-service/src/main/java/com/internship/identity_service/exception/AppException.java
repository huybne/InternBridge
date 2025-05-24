package com.internship.identity_service.exception;

public class AppException extends RuntimeException {
    private final ErrorCode errorCode;

    // Constructor mặc định với message cố định
    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    // Constructor kèm theo nguyên nhân (cause)
    public AppException(ErrorCode errorCode, Throwable cause) {
        super(errorCode.getMessage(), cause);
        this.errorCode = errorCode;
    }

    //
    // Constructor cho phép truyền message động
    public AppException(ErrorCode errorCode, Object... args) {
        super(String.format(errorCode.getMessage(), args));
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
