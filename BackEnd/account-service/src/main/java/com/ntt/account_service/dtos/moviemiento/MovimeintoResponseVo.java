package com.ntt.account_service.dtos.moviemiento;

public class MovimeintoResponseVo {

    private String numeroCuenta;
    private String tipo;
    private String saldo;
    private Boolean estado;
    private String movimiento;
    private Long movimientoId;
    private String fecha;

    public MovimeintoResponseVo() {
    }

    public MovimeintoResponseVo(String numeroCuenta, String tipo, String saldo, Boolean estado,
                                String movimiento, Long movimientoId, String fecha) {
        this.numeroCuenta = numeroCuenta;
        this.tipo = tipo;
        this.saldo = saldo;
        this.estado = estado;
        this.movimiento = movimiento;
        this.movimientoId = movimientoId;
        this.fecha = fecha;
    }

    public String getNumeroCuenta() {
        return numeroCuenta;
    }

    public void setNumeroCuenta(String numeroCuenta) {
        this.numeroCuenta = numeroCuenta;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getSaldo() {
        return saldo;
    }

    public void setSaldo(String saldo) {
        this.saldo = saldo;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public String getMovimiento() {
        return movimiento;
    }

    public void setMovimiento(String movimiento) {
        this.movimiento = movimiento;
    }

    public Long getMovimientoId() {
        return movimientoId;
    }

    public void setMovimientoId(Long movimientoId) {
        this.movimientoId = movimientoId;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
}
