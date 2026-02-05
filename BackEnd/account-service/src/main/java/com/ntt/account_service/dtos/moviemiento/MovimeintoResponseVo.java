package com.ntt.account_service.dtos.moviemiento;

public class MovimeintoResponseVo {
    private Long numeroCuenta;
    private String tipo;
    private String saldo;
    private Boolean estado;
    private String Movimiento;

    public MovimeintoResponseVo() {
    }

    public Long getNumeroCuenta() {
        return numeroCuenta;
    }

    public void setNumeroCuenta(Long numeroCuenta) {
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

    public void setSaldo(String saldoInicial) {
        this.saldo = saldoInicial;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public String getMovimiento() {
        return Movimiento;
    }

    public void setMovimiento(String movimiento) {
        Movimiento = movimiento;
    }
}
