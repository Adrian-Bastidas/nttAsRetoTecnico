package com.tcs.account_service.dtos.cliente;

public class ClienteVo {
    private Long clienteId;
    private String nombre;
    public String identificacion;

    public ClienteVo() {}

    // Getters y Setters
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

}
