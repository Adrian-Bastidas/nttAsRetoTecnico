package com.tcs.account_service.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ClienteNoEncontradoException.class)
    public ResponseEntity<Object> handleClienteNoEncontrado(ClienteNoEncontradoException ex) {
        logger.warn("Cliente no encontrado: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, "Cliente no encontrado", ex.getMessage());
    }

    @ExceptionHandler(CuentaNoEncontradaException.class)
    public ResponseEntity<Object> handleCuentaNoEncontrada(CuentaNoEncontradaException ex) {
        logger.warn("Cuenta no encontrada: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, "Cuenta no encontrada", ex.getMessage());
    }

    @ExceptionHandler(MovimientoNoEncontradoException.class)
    public ResponseEntity<Object> handleMovimientoNoEncontrado(MovimientoNoEncontradoException ex) {
        logger.warn("Movimiento no encontrado: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, "Movimiento no encontrado", ex.getMessage());
    }

    @ExceptionHandler(SaldoInsuficiente.class)
    public ResponseEntity<Object> handleSaldoInsuficiente(SaldoInsuficiente ex) {
        logger.warn("Saldo insuficiente: {}", ex.getMessage());
        return buildResponse(HttpStatus.FORBIDDEN, "Saldo insuficiente", ex.getMessage());
    }

    @ExceptionHandler(UserServiceUnavailableException.class)
    public ResponseEntity<Object> handleUserServiceUnavailable(UserServiceUnavailableException ex) {
        logger.error("Servicio de usuario no disponible: {}", ex.getMessage());
        return buildResponse(HttpStatus.SERVICE_UNAVAILABLE, "Servicio no disponible", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralException(Exception ex) {
        logger.error("Error interno del servidor: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor", ex.getMessage());
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
