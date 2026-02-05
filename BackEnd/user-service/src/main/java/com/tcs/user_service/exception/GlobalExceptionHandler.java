package com.tcs.user_service.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralException(Exception ex) {
        logger.error("Error interno del servidor: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor", ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleNotFound(ResourceNotFoundException ex) {
        logger.warn("Recurso no encontrado: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, "Recurso no encontrado", ex.getMessage());
    }

    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<Object> handleInsufficientBalance(InsufficientBalanceException ex) {
        logger.warn("Saldo insuficiente: {}", ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, "Saldo insuficiente", ex.getMessage());
    }

    @ExceptionHandler(ResourceAlreadyExistException.class)
    public ResponseEntity<Object> handleAlreadyExistException(ResourceAlreadyExistException ex) {
        logger.warn("Recurso ya existe: {}", ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, "Ya existe el recurso solicitado", ex.getMessage());
    }

    private ResponseEntity<Object> buildResponse(HttpStatus status, String error, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);

        return new ResponseEntity<>(body, status);
    }
}
