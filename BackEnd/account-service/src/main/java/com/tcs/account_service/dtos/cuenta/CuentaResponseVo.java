package com.tcs.account_service.dtos.cuenta;

import com.tcs.account_service.dtos.cliente.ClienteVo;

public class CuentaResponseVo {
    private Long cuentaId;
    private String numeroCuenta;
    private String tipoCuenta;
    private Long saldoInicial;
    private Boolean estado;
    private ClienteVo cliente;

    // Constructores
    public void CuentaVo() {}


    public Long getCuentaId() { return cuentaId; }
    public void setCuentaId(Long cuentaId) { this.cuentaId = cuentaId; }

    public String getNumeroCuenta() { return numeroCuenta; }
    public void setNumeroCuenta(String numeroCuenta) { this.numeroCuenta = numeroCuenta; }

    public String getTipoCuenta() { return tipoCuenta; }
    public void setTipoCuenta(String tipoCuenta) { this.tipoCuenta = tipoCuenta; }

    public Long getSaldoInicial() { return saldoInicial; }
    public void setSaldoInicial(Long saldoInicial) { this.saldoInicial = saldoInicial; }

    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }

    public ClienteVo getCliente() { return cliente; }
    public void setCliente(ClienteVo cliente) { this.cliente = cliente; }
}
