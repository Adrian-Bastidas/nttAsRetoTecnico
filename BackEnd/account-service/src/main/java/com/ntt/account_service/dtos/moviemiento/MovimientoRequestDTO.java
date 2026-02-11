package com.ntt.account_service.dtos.moviemiento;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.Date;

public class MovimientoRequestDTO {

    @NotBlank(message = "Número de cuenta es requerido")
    private String numeroCuenta;

    @NotNull(message = "Fecha es requerida")
    private Date fecha;

    @NotNull(message = "Valor es requerido")
    private Long valor;

    @NotBlank(message = "Tipo de movimiento es requerido")
    private String tipo;

    public MovimientoRequestDTO() {
    }

    public MovimientoRequestDTO(String numeroCuenta, Date fecha, Long valor, String tipo) {
        this.numeroCuenta = numeroCuenta;
        this.fecha = fecha;
        this.valor = valor;
        this.tipo = tipo;
    }

    public String getNumeroCuenta() {
        return numeroCuenta;
    }

    public void setNumeroCuenta(String numeroCuenta) {
        this.numeroCuenta = numeroCuenta;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Long getValor() {
        return valor;
    }

    public void setValor(Long valor) {
        this.valor = valor;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}