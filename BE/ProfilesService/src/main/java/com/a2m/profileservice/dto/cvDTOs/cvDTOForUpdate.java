package com.a2m.profileservice.dto.cvDTOs;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class cvDTOForUpdate {
    private String cvId;
    private String title;
    private String cvDetail;
}
