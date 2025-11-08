package com.flexidesk.servicereservations.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReservationResponse {
    private Long id;
    private Long ressourceId;
    private Long userId;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
}