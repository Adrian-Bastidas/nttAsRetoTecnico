package com.ntt.account_service.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.Date;

@Entity
@Table(name = "movimiento")
public class Movimiento {

    @Id
    @GeneratedValue(generator = "movimiento-id-generator")
    @GenericGenerator(
            name = "movimiento-id-generator",
            strategy = "com.ntt.account_service.utils.SafeRandomIdGenerator"
    )
    @Column(name = "movimiento_id")
    private Long movimientoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cuenta_id", nullable = false)
    private Cuenta cuenta;

    @Column(name = "fecha")
    private Date fecha;

    @Column(name = "tipo_movimiento")
    private String tipoMovimiento;

    @Column(name = "valor")
    private Long valor;

    @Column(name = "saldo")
    private Long saldo;


    public Movimiento() {
    }

    public Movimiento(Long movimientoId, Cuenta cuenta, Date fecha, String tipoMovimiento, Long valor, Long saldo) {
        this.movimientoId = movimientoId;
        this.cuenta = cuenta;
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

    public Cuenta getCuenta() {
        return cuenta;
    }

    public void setCuenta(Cuenta cuenta) {
        this.cuenta = cuenta;
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

    @Override
    public String toString() {
        return "Movimiento{" +
                "movimientoId=" + movimientoId +
                ", cuentaId=" + (cuenta != null ? cuenta.getCuentaId() : null) +
                ", fecha=" + fecha +
                ", tipoMovimiento='" + tipoMovimiento + '\'' +
                ", valor=" + valor +
                ", saldo=" + saldo +
                '}';
    }
}