package com.tcs.user_service.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

@Entity
public class Cliente extends Persona {

    @Column(unique = true, nullable = false)
    private Long clienteId;
    private String contrasena;

    private Boolean estado;


    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }
    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String password) {
        this.contrasena = password;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}
