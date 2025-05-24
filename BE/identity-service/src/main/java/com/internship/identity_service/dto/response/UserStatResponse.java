package com.internship.identity_service.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UserStatResponse {
    private int total;
    private int active;
    private int inactive;
    private int banned;
}
