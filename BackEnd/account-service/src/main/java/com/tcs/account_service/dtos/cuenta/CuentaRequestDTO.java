package com.tcs.account_service.dtos.cuenta;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CuentaRequestDTO {
    @NotNull(message = "Cliente ID es requerido")
    private Long clienteId;

    @NotBlank(message = "Tipo de cuenta es requerido")
    @Size(max = 50, message = "Tipo de cuenta no puede exceder 50 caracteres")
    private String tipoCuenta;

    @NotNull(message = "Saldo inicial es requerido")
    @Min(value = 0, message = "Saldo inicial debe ser mayor o igual a 0")
    private Long saldoInicial;

    public CuentaRequestDTO() {}

    public CuentaRequestDTO(Long clienteId, String tipoCuenta, Long saldoInicial) {
        this.clienteId = clienteId;
        this.tipoCuenta = tipoCuenta;
        this.saldoInicial = saldoInicial;
    }

    // Getters y Setters
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }

    public String getTipoCuenta() { return tipoCuenta; }
    public void setTipoCuenta(String tipoCuenta) { this.tipoCuenta = tipoCuenta; }

    public Long getSaldoInicial() { return saldoInicial; }
    public void setSaldoInicial(Long saldoInicial) { this.saldoInicial = saldoInicial; }
}
