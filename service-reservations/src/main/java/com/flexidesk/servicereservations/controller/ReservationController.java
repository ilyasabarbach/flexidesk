package com.flexidesk.servicereservations.controller;

import com.flexidesk.servicereservations.dto.ReservationRequest;
import com.flexidesk.servicereservations.dto.ReservationResponse;
import com.flexidesk.servicereservations.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;


    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @RequestBody ReservationRequest request,
            @RequestParam("userId") Long userId
    ) {
        ReservationResponse response = reservationService.createReservation(request, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponse>> getReservationsForUser(
            @PathVariable("userId") Long userId
    ) {
        List<ReservationResponse> responses = reservationService.getReservationsByUserId(userId);
        return ResponseEntity.ok(responses);
    }
}
