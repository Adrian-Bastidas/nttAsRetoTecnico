package com.tcs.account_service.exception;

public class CuentaNoEncontradaException extends RuntimeException {
    public CuentaNoEncontradaException(String message) {
        super(message);
    }
}
