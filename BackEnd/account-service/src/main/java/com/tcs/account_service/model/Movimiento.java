package com.tcs.account_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.hibernate.annotations.GenericGenerator;

import java.util.Date;

@Entity
public class Movimiento {
    @Id
    @GeneratedValue(generator = "movimiento-id-generator")
    @GenericGenerator(
            name = "movimiento-id-generator",
            strategy = "com.tcs.account_service.utils.SafeRandomIdGenerator"
    )
    private Long movimientoId;
    private Long cuentaId;
    private Date fecha;
    private String tipoMovimiento;
    private Long valor;
    private Long saldo;

    public Movimiento() {
    }

    public Movimiento(Long movimientoId, Long cuentaId, Date fecha, String tipoMovimiento, Long valor, Long saldo) {
        this.movimientoId = movimientoId;
        this.cuentaId = cuentaId;
        this.fecha = fecha;
        this.tipoMovimiento = tipoMovimiento;
        this.valor = valor;
        this.saldo = saldo;
    }

    public Long getMovimientoId() {
        return movimientoId;
    }

    public void setMovimientoId(Long movimientoId) {
        this.movimientoId = movimientoId;
    }

    public Long getCuentaId() {
        return cuentaId;
    }

    public void setCuentaId(Long cuentaId) {
        this.cuentaId = cuentaId;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public String getTipoMovimiento() {
        return tipoMovimiento;
    }

    public void setTipoMovimiento(String tipoMovimiento) {
        this.tipoMovimiento = tipoMovimiento;
    }

    public Long getValor() {
        return valor;
    }

    public void setValor(Long valor) {
        this.valor = valor;
    }

    public Long getSaldo() {
        return saldo;
    }

    public void setSaldo(Long saldo) {
        this.saldo = saldo;
    }
}
