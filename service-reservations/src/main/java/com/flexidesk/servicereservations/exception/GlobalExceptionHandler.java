package com.flexidesk.servicereservations.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Capture l'erreur de Header Manquant (ex: X-User-Id)
    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<Map<String, String>> handleMissingHeader(MissingRequestHeaderException ex) {
        String errorMessage = "⚠️ ERREUR HEADER : Le header '" + ex.getHeaderName() + "' est manquant.";
        System.err.println(errorMessage); // Affiche en ROUGE dans le terminal

        Map<String, String> error = new HashMap<>();
        error.put("message", errorMessage);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 2. Capture l'erreur de format JSON (ex: Problème de Date)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleJsonError(HttpMessageNotReadableException ex) {
        String errorMessage = "⚠️ ERREUR JSON : Impossible de lire les données. Format de date incorrect ?";
        System.err.println(errorMessage);
        System.err.println("Détail technique : " + ex.getMostSpecificCause().getMessage());

        Map<String, String> error = new HashMap<>();
        error.put("message", errorMessage);
        error.put("details", ex.getMostSpecificCause().getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 3. Capture toutes les autres erreurs 400 (Validation, etc.)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        System.err.println("⚠️ ERREUR ARGUMENT : " + ex.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String errorMessage = "⚠️ ERREUR TYPE : Le paramètre '" + ex.getName() + "' a une valeur invalide : " + ex.getValue();
        System.err.println(errorMessage);

        Map<String, String> error = new HashMap<>();
        error.put("message", errorMessage);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}