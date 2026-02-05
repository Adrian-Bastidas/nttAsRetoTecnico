package com.tcs.account_service.dtos.moviemiento;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Date;

public class MovimientoRequestDTO {
    @NotNull(message = "NúmeroCuenta es requerido")
    private String numeroCuenta;

    @NotBlank(message = "Tipo de cuenta es requerido")
    @Size(max = 50, message = "Tipo de cuenta no puede exceder 50 caracteres")
    private Date fecha;
    @NotBlank(message = "Valor es requerido")
    private Long valor;

    @NotBlank(message = "Tipo es requerido")
    private String tipo;

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
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
}
