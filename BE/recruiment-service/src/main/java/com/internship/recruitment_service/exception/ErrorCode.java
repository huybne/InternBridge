package com.internship.recruitment_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // 1xxx – Auth
    CATEGORY_EXISTED(1001, "Category already exists", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(1002, "Category not found", HttpStatus.NOT_FOUND),
    JOB_POSTING_NOT_FOUND(1003, "Job posting not found", HttpStatus.NOT_FOUND),
    APPLY_JOB_NOT_FOUND(1004, "Apply job not found", HttpStatus.NOT_FOUND),
    JOB_POSTING_NOT_EDITED(1005, "Job posting not edited", HttpStatus.BAD_REQUEST),
    APPLY_JOB_ALREADY_EXISTS(1006, "Apply job already exists", HttpStatus.BAD_REQUEST),
    APPLY_JOB_CREATION_FAILED(1007, "Apply job creation failed", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERVIEW_SCHEDULE_NOT_FOUND(1008, "Interview schedule not found", HttpStatus.NOT_FOUND),
    STUDENT_PROFILE_NOT_FOUND(1009, "Student profile not found", HttpStatus.NOT_FOUND),
    SCHEDULE_HAS_BEEN_EDITED(1010, "Schedule has been edited, You can not edit", HttpStatus.BAD_REQUEST),
    INTERVIEW_STATUS_NOT_PENDING(1011, "Only pending interviews can be updated", HttpStatus.BAD_REQUEST),
    IMAGE_BUSINESS_NOT_FOUND(1012, "Image business not found", HttpStatus.NOT_FOUND),
    INVALID_STATUS(1013, "Invalid status", HttpStatus.BAD_REQUEST),
    APPLY_JOB_ALREADY_ACCEPTED_OR_REJECTED(1014, "Apply job cannot edited", HttpStatus.BAD_REQUEST),

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
    STUDENT_ALREADY_REGISTERED(5001, "Student is already registered", HttpStatus.BAD_REQUEST),
    STUDENT_NOT_FOUND(5002, "Student not found", HttpStatus.NOT_FOUND),
    INTERNSHIP_NOT_FOUND(5003, "Internship not found", HttpStatus.NOT_FOUND),
    JOB_ALREADY_APPLIED(5004, "You have already applied for this job", HttpStatus.CONFLICT),
    JOB_NOT_FOUND(5005, "Job not found", HttpStatus.NOT_FOUND),
    EMPLOYER_NOT_FOUND(5006, "Employer not found", HttpStatus.NOT_FOUND),
    INTERNSHIP_CREATION_FAILED(5007, "Failed to create internship", HttpStatus.INTERNAL_SERVER_ERROR),
    APPLICATION_DUPLICATE(5008, "Application already exists", HttpStatus.CONFLICT),
    ROLE_ASSIGNMENT_FAILED(5009, "Failed to assign role", HttpStatus.INTERNAL_SERVER_ERROR),

    // 9xxx – System
    INTERNAL_ERROR(9999, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_TOKEN (9998, "Invalid token", HttpStatus.UNAUTHORIZED),
    NOT_AUTHORIZED(9997, "You are not authorized to perform this action", HttpStatus.FORBIDDEN),

    ADD_FARVORITE_JOB_FAILED(1014,  "Add farvorite job failed" , HttpStatus.BAD_REQUEST ),
    REMOVE_FARVORITE_JOB_FAILED(1015,  "Remove farvorite job failed" , HttpStatus.BAD_REQUEST ),
    NOT_EXITS_JOB_FARVORITE(1016,"NOT_EXITS_JOB_FARVORITE" , HttpStatus.BAD_REQUEST);
    private final int code;
    private final String message;
    private final HttpStatus status;

    ErrorCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}