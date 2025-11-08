package com.flexidesk.servicereservations.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReservationRequest {
    private Long ressourceId;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
}