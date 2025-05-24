package com.a2m.profileservice.dto.StudentCardDTO;

import lombok.*;

@Data
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentCardDTO {
    private String cardId;
    private String studentCardUrl;
    private boolean isDeleted;
}
