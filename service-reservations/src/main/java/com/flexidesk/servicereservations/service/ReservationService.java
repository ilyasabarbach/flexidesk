package com.flexidesk.servicereservations.service;

import com.flexidesk.servicereservations.dto.ReservationRequest;
import com.flexidesk.servicereservations.dto.ReservationResponse;
import com.flexidesk.servicereservations.model.Reservation;
import com.flexidesk.servicereservations.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;


    public ReservationResponse createReservation(ReservationRequest request, Long userId) {

        if (request.getDateFin().isBefore(request.getDateDebut())) {
            throw new IllegalArgumentException("La date de fin doit être après la date de début.");
        }

        List<Reservation> conflits = reservationRepository.findByRessourceIdAndDateFinAfterAndDateDebutBefore(
                request.getRessourceId(),
                request.getDateDebut(),
                request.getDateFin()
        );

        if (!conflits.isEmpty()) {
            throw new IllegalStateException("Conflit de réservation. Le créneau est déjà pris.");
        }

        Reservation newReservation = new Reservation();
        newReservation.setRessourceId(request.getRessourceId());
        newReservation.setDateDebut(request.getDateDebut());
        newReservation.setDateFin(request.getDateFin());
        newReservation.setUserId(userId);

        Reservation savedReservation = reservationRepository.save(newReservation);

        return mapToResponse(savedReservation);
    }


    public List<ReservationResponse> getReservationsByUserId(Long userId) {
        return reservationRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ReservationResponse mapToResponse(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .ressourceId(reservation.getRessourceId())
                .userId(reservation.getUserId())
                .dateDebut(reservation.getDateDebut())
                .dateFin(reservation.getDateFin())
                .build();
    }
}