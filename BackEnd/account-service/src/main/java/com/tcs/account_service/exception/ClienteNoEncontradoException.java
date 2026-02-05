package com.tcs.account_service.exception;

public class ClienteNoEncontradoException extends RuntimeException {
    public ClienteNoEncontradoException(String message) {
        super(message);
    }
}
