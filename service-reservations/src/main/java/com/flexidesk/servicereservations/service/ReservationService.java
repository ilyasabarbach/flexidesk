package com.flexidesk.servicereservations.service;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.flexidesk.servicereservations.dto.ReservationRequest;
import com.flexidesk.servicereservations.dto.ReservationResponse;
import com.flexidesk.servicereservations.model.Reservation;
import com.flexidesk.servicereservations.repository.ReservationRepository;
import jakarta.servlet.http.HttpServletRequest; // Import nécessaire
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity; // Import nécessaire
import org.springframework.http.HttpHeaders; // Import nécessaire
import org.springframework.http.HttpMethod; // Import nécessaire
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
    private final HttpServletRequest servletRequest; // On injecte la requête courante pour lire ses headers

    public ReservationResponse createReservation(ReservationRequest request, Long userId) {

        // 1. VÉRIFICATION INTER-SERVICE : Existence de la ressource (AVEC HEADERS)
        try {
            String resourceUrl = "http://localhost:8081/api/v1/ressources/" + request.getRessourceId();

            // --- NOUVEAU : On prépare les headers à envoyer ---
            HttpHeaders headers = new HttpHeaders();
            // On récupère les infos de l'utilisateur courant
            String currentUserId = servletRequest.getHeader("X-User-Id");
            String currentUserRoles = servletRequest.getHeader("X-User-Roles");

            // On les ajoute à la nouvelle requête
            if (currentUserId != null) headers.set("X-User-Id", currentUserId);
            if (currentUserRoles != null) headers.set("X-User-Roles", currentUserRoles);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // On utilise 'exchange' au lieu de 'getForEntity' pour inclure les headers
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
            // Affiche l'erreur réelle dans la console pour debug
            System.err.println("❌ Erreur communication Service Ressources : " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossible de valider la ressource (Service Ressources injoignable ou Accès refusé).");
        }

        // 2. VÉRIFICATION MÉTIER : Dates cohérentes
        if (request.getDateFin().isBefore(request.getDateDebut())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de fin doit être après la date de début.");
        }

        // 3. VÉRIFICATION DISPONIBILITÉ
        List<Reservation> conflits = reservationRepository.findByRessourceIdAndDateFinAfterAndDateDebutBefore(
                request.getRessourceId(),
                request.getDateDebut(),
                request.getDateFin()
        );

        if (!conflits.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Conflit de réservation : Le créneau est déjà pris.");
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