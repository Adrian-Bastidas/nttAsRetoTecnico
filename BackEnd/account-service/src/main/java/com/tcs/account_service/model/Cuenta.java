package com.tcs.account_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.hibernate.annotations.GenericGenerator;

@Entity
public class Cuenta {
    @Id
    @GeneratedValue(generator = "cuenta-id-generator")
    @GenericGenerator(
            name = "cuenta-id-generator",
            strategy = "com.tcs.account_service.utils.SafeRandomIdGenerator"
    )
    private Long cuentaId;
    private Long clienteId;
    private String numeroCuenta;
    private String tipoCuenta;
    private Long saldoInicial;
    private Boolean estado;
    public Cuenta() {}
    public Cuenta(Long cuentaId, Long clienteId, String numeroCuenta, String tipoCuenta, Long saldoInicial, Boolean estado) {
        this.cuentaId = cuentaId;
        this.clienteId = clienteId;
        this.numeroCuenta = numeroCuenta;
        this.tipoCuenta = tipoCuenta;
        this.saldoInicial = saldoInicial;
        this.estado = estado;
    }

    public Long getCuentaId() {
        return cuentaId;
    }

    public void setCuentaId(Long cuentaId) {
        this.cuentaId = cuentaId;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getNumeroCuenta() {
        return numeroCuenta;
    }

    public void setNumeroCuenta(String numeroCuenta) {
        this.numeroCuenta = numeroCuenta;
    }

    public String getTipoCuenta() {
        return tipoCuenta;
    }

    public void setTipoCuenta(String tipoCuenta) {
        this.tipoCuenta = tipoCuenta;
    }

    public Long getSaldoInicial() {
        return saldoInicial;
    }

    public void setSaldoInicial(Long saldoInicial) {
        this.saldoInicial = saldoInicial;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}
