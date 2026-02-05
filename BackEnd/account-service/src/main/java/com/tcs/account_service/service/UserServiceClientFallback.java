package com.tcs.account_service.service;

import com.tcs.account_service.dtos.cliente.ClienteVo;
import com.tcs.account_service.exception.UserServiceUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class UserServiceClientFallback implements UserServiceClient {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceClientFallback.class);


    @Override
    public ClienteVo obtenerCliente(Long clienteId) {
        logger.error("Fallback activado: no se pudo obtener cliente {}", clienteId);
        throw new UserServiceUnavailableException("User Service no disponible - Cliente ID: " + clienteId);
    }

    @Override
    public void activarCliente(Long clienteId) {
        logger.error("Fallback activado: no se pudo activar cliente {}", clienteId);
        throw new UserServiceUnavailableException("User Service no disponible - No se pudo activar cliente: " + clienteId);
    }

    @Override
    public void notificarCuentaCreada(Long clienteId, Long cuentaId) {
        logger.error("Fallback activado: no se pudo notificar creación de cuenta {} para cliente {}", cuentaId, clienteId);
        throw new UserServiceUnavailableException("User Service no disponible - No se pudo notificar creación de cuenta");
    }
}
