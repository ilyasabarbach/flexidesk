package com.flexidesk.servicereservations.service;

import com.flexidesk.servicereservations.dto.ReservationRequest;
import com.flexidesk.servicereservations.dto.ReservationResponse;
import com.flexidesk.servicereservations.model.Reservation;
import com.flexidesk.servicereservations.repository.ReservationRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RestTemplate restTemplate;
    private final HttpServletRequest servletRequest;

    public ReservationResponse createReservation(ReservationRequest request, Long userId) {

        // 1. VÉRIFICATION INTER-SERVICE : Existence de la ressource (AVEC HEADERS)
        try {
            String resourceUrl = "http://localhost:8081/api/v1/ressources/" + request.getRessourceId();

            HttpHeaders headers = new HttpHeaders();
            String currentUserId = servletRequest.getHeader("X-User-Id");
            String currentUserRoles = servletRequest.getHeader("X-User-Roles");

            if (currentUserId != null) headers.set("X-User-Id", currentUserId);
            if (currentUserRoles != null) headers.set("X-User-Roles", currentUserRoles);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Object> response = restTemplate.exchange(
                    resourceUrl,
                    HttpMethod.GET,
                    entity,
                    Object.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La ressource demandée n'existe pas.");
            }
        } catch (Exception e) {
            System.err.println("❌ Erreur communication Service Ressources : " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossible de valider la ressource (Service Ressources injoignable ou Accès refusé).");
        }

        // 2. VÉRIFICATION MÉTIER : Dates cohérentes
        if (request.getDateFin().isBefore(request.getDateDebut())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de fin doit être après la date de début.");
        }

        // 3. VÉRIFICATION DISPONIBILITÉ (CORRIGÉ POUR AFFICHER LE DÉTAIL)
        List<Reservation> conflits = reservationRepository.findByRessourceIdAndDateFinAfterAndDateDebutBefore(
                request.getRessourceId(),
                request.getDateDebut(),
                request.getDateFin()
        );

        if (!conflits.isEmpty()) {
            // --- MODIFICATION ICI : Message d'erreur précis ---
            Reservation conflit = conflits.get(0);
            String message = String.format("Conflit : Ce créneau chevauche une réservation existante du %s au %s.",
                    conflit.getDateDebut().toString().replace("T", " à "),
                    conflit.getDateFin().toString().replace("T", " à "));

            throw new ResponseStatusException(HttpStatus.CONFLICT, message);
        }

        // 4. CRÉATION
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