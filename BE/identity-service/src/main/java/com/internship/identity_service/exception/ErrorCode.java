package com.internship.identity_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // ================================
    // 1xxx – Authentication & User
    // ================================
    USER_EXISTED(1001, "User already exists", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1002, "User not found", HttpStatus.NOT_FOUND),
    INVALID_CREDENTIALS(1003, "Email or password is incorrect", HttpStatus.UNAUTHORIZED),
    ROLE_ID_NOT_FOUND(1010, "Role with Id: %s not found", HttpStatus.NOT_FOUND),
    ROLE_NOT_FOUND(1011, "Role not found", HttpStatus.NOT_FOUND),

    // ================================
    // 2xxx – Validation & Access
    // ================================
    VALIDATION_ERROR(2001, "Invalid input: {field}", HttpStatus.BAD_REQUEST),
    INVALID_OLD_PASSWORD(2002, "Invalid old password", HttpStatus.BAD_REQUEST),
    ACCESS_DENIED(2003, "Access denied, you don’t have permission to do this work", HttpStatus.FORBIDDEN),
    MISSING_REQUIRED_FIELD(2004, "Missing required field: {field}", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST_FORMAT(2005, "Request format is invalid", HttpStatus.BAD_REQUEST),
    METHOD_NOT_ALLOWED(2006, "Method not allowed", HttpStatus.METHOD_NOT_ALLOWED),

    // ================================
    // 3xxx – Business Logic Errors
    // ================================
    OUT_OF_STOCK(3001, "Product is out of stock", HttpStatus.CONFLICT),
    RESOURCE_CONFLICT(3002, "Conflict: resource already exists or in use", HttpStatus.CONFLICT),

    // ================================
    // 4xxx – Database Errors
    // ================================
    DATABASE_CONNECTION_FAILED(4001, "Failed to connect to the database", HttpStatus.INTERNAL_SERVER_ERROR),
    DUPLICATE_ENTRY(4002, "Duplicate entry detected", HttpStatus.CONFLICT),
    CONSTRAINT_VIOLATION(4003, "Database constraint violation", HttpStatus.BAD_REQUEST),
    DATA_INTEGRITY_ERROR(4004, "Data integrity error", HttpStatus.INTERNAL_SERVER_ERROR),
    SQL_SYNTAX_ERROR(4005, "SQL syntax error", HttpStatus.BAD_REQUEST),

    // ================================
    // 5xxx – Internship Application
    // ================================
    STUDENT_ALREADY_REGISTERED(5001, "Student is already registered", HttpStatus.BAD_REQUEST),
    STUDENT_NOT_FOUND(5002, "Student not found", HttpStatus.NOT_FOUND),
    INTERNSHIP_NOT_FOUND(5003, "Internship not found", HttpStatus.NOT_FOUND),
    JOB_ALREADY_APPLIED(5004, "You have already applied for this job", HttpStatus.CONFLICT),
    JOB_NOT_FOUND(5005, "Job not found", HttpStatus.NOT_FOUND),
    EMPLOYER_NOT_FOUND(5006, "Employer not found", HttpStatus.NOT_FOUND),
    INTERNSHIP_CREATION_FAILED(5007, "Failed to create internship", HttpStatus.INTERNAL_SERVER_ERROR),
    APPLICATION_DUPLICATE(5008, "Application already exists", HttpStatus.CONFLICT),
    ROLE_ASSIGNMENT_FAILED(5009, "Failed to assign role", HttpStatus.INTERNAL_SERVER_ERROR),
    TOKEN_EXPIRED(401, "Token expired", HttpStatus.UNAUTHORIZED),
    // ================================
    // 9xxx – System & Token
    // ================================
    INTERNAL_ERROR(9999, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_REFRESH_TOKEN(9997, "Invalid Refresh Token", HttpStatus.UNAUTHORIZED),
    TOKEN_ALREADY_REVOKED(9996, "Token already revoked", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_NOT_FOUND(9998, "Refresh token not found", HttpStatus.NOT_FOUND),
    UNAUTHORIZED(9995, "Refresh token has been revoked", HttpStatus.UNAUTHORIZED),
    INVALID_OR_EXPIRED_TOKEN(9994, "Token is invalid or has expired", HttpStatus.UNAUTHORIZED),
    UNAUTHENTICATED(401, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    INVALID_ACCESS_TOKEN(9992, "Invalid access token", HttpStatus.UNAUTHORIZED),
    INVALID_LOGIN(9991, "This account was not registered via local provider", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatus status;

    ErrorCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
