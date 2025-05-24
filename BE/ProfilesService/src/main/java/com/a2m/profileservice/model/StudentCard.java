package com.a2m.profileservice.model;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class StudentCard {
    private String cardId;
    private String studentId;
    private String studentCardUrl;
    private boolean isDeleted;
}
