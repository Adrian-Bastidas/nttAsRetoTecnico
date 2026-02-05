package com.tcs.account_service.exception;

public class SaldoInsuficiente extends RuntimeException {
    public SaldoInsuficiente(String message) {
        super(message);
    }
}
