package com.tcs.account_service.dtos.cuenta;

import java.time.LocalDate;
import java.util.Date;

public class EstadoCuentaReporteVO {
    private Date fecha;
    private String cliente;
    private String numeroCuenta;
    private String tipo;
    private double saldoInicial;
    private boolean estado;
    private double movimiento;
    private double saldoDisponible;

    public EstadoCuentaReporteVO(Date fecha, String cliente, String numeroCuenta, String tipo,
                                 double saldoInicial, boolean estado, double movimiento, double saldoDisponible) {
        this.fecha = fecha;
        this.cliente = cliente;
        this.numeroCuenta = numeroCuenta;
        this.tipo = tipo;
        this.saldoInicial = saldoInicial;
        this.estado = estado;
        this.movimiento = movimiento;
        this.saldoDisponible = saldoDisponible;
    }

    public Date getFecha() { return fecha; }
    public String getCliente() { return cliente; }
    public String getNumeroCuenta() { return numeroCuenta; }
    public String getTipo() { return tipo; }
    public double getSaldoInicial() { return saldoInicial; }
    public boolean isEstado() { return estado; }
    public double getMovimiento() { return movimiento; }
    public double getSaldoDisponible() { return saldoDisponible; }
}