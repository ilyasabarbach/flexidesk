package com.flexidesk.servicereservations.repository;

import com.flexidesk.servicereservations.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {


    List<Reservation> findByRessourceIdAndDateFinAfterAndDateDebutBefore(
            Long ressourceId,
            LocalDateTime dateDebut,
            LocalDateTime dateFin
    );


    List<Reservation> findByUserId(Long userId);
}