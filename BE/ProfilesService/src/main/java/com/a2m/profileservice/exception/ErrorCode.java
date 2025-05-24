package com.a2m.profileservice.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // 1xxx – Auth
    BUSINESS_Not_PROFILE(1000, "Business not exists", HttpStatus.BAD_REQUEST),
    BUSINESS_EXISTED(1001, "Business already exists", HttpStatus.BAD_REQUEST),
    BUSINESS_NOT_FOUND(1002, "Business not found", HttpStatus.NOT_FOUND),
    BUSINESS_IMAGE_NOT_FOUND(1003, "Business image not found", HttpStatus.NOT_FOUND),
    INVALID_CREDENTIALS(1004, "Username or password is incorrect", HttpStatus.UNAUTHORIZED),
    BUSINESS_NOT_AUTHORIZED(1005, "Business not authorized", HttpStatus.FORBIDDEN),
    USER_NOT_FOUND(1002, "User not found", HttpStatus.NOT_FOUND),
    // 2xxx – Validation
    VALIDATION_ERROR(2001, "Invalid input: {field}", HttpStatus.BAD_REQUEST),

    // 3xxx – Business Logic
    OUT_OF_STOCK(3001, "Product is out of stock", HttpStatus.CONFLICT),

    // 4xxx – Database Errors
    DATABASE_CONNECTION_FAILED(4001, "Failed to connect to the database", HttpStatus.INTERNAL_SERVER_ERROR),
    DUPLICATE_ENTRY(4002, "Duplicate entry detected", HttpStatus.CONFLICT),
    CONSTRAINT_VIOLATION(4003, "Database constraint violation", HttpStatus.BAD_REQUEST),
    DATA_INTEGRITY_ERROR(4004, "Data integrity error", HttpStatus.INTERNAL_SERVER_ERROR),
    SQL_SYNTAX_ERROR(4005, "SQL syntax error", HttpStatus.BAD_REQUEST),

    // 5xxx – Internship Application Errors
    STUDENT_NOT_PROFILE(5000, "Business not exists", HttpStatus.BAD_REQUEST),
    STUDENT_ALREADY_REGISTERED(5001, "Student is already registered", HttpStatus.BAD_REQUEST),
    STUDENT_NOT_FOUND(5002, "Student not found", HttpStatus.NOT_FOUND),
    INTERNSHIP_NOT_FOUND(5003, "Internship not found", HttpStatus.NOT_FOUND),
    JOB_ALREADY_APPLIED(5004, "You have already applied for this job", HttpStatus.CONFLICT),
    JOB_NOT_FOUND(5005, "Job not found", HttpStatus.NOT_FOUND),
    EMPLOYER_NOT_FOUND(5006, "Employer not found", HttpStatus.NOT_FOUND),
    INTERNSHIP_CREATION_FAILED(5007, "Failed to create internship", HttpStatus.INTERNAL_SERVER_ERROR),
    APPLICATION_DUPLICATE(5008, "Application already exists", HttpStatus.CONFLICT),
    ROLE_ASSIGNMENT_FAILED(5009, "Failed to assign role", HttpStatus.INTERNAL_SERVER_ERROR),

    //REQUEST_BUSINESS
    REQUEST_BUSINESS_NOT_FOUND(5010, "Request business not found", HttpStatus.BAD_REQUEST),


    //sang
    REQUEST_STUDENT_ALREADY_REGISTERED(6001, "Register Student already registered", HttpStatus.BAD_REQUEST),
    REQUEST_STUDENT_NOT_REGISTERED(6002, "Student not registered", HttpStatus.BAD_REQUEST),
    CV_NOT_FOUND(6002, "CV not found", HttpStatus.NOT_FOUND),
    CV_NOT_OWNER(6003, "CV not OWNER", HttpStatus.BAD_REQUEST),



    //farvorite Job
    ADD_FARVORITE_JOB_FAILED(7000, "Add Farvorite job failed", HttpStatus.BAD_REQUEST),
    REMOVE_FARVORITE_JOB_FAILED(7001, "Remove Farvorite job failed", HttpStatus.BAD_REQUEST),
    NO_FARVORITE_JOB(7002, "No Farvorite job", HttpStatus.BAD_REQUEST),

    // 9xxx – System
    INTERNAL_ERROR(9999, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
    MISSING_REASON(9998, "You forgot the reason when you reject the request", HttpStatus.INTERNAL_SERVER_ERROR);
    private final int code;
    private final String message;
    private final HttpStatus status;

    ErrorCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}