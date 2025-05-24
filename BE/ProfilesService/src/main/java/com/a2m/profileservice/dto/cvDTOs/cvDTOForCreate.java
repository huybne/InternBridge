package com.a2m.profileservice.dto.cvDTOs;

import lombok.*;

import java.util.Date;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
@Builder
public class cvDTOForCreate {
    private String title;
    private String cvDetail;
}
