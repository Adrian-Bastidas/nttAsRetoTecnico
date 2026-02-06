package com.ntt.account_service.service;

import com.ntt.account_service.dtos.cliente.ClienteVo;
import com.ntt.account_service.exception.UserServiceUnavailableException;
import com.ntt.account_service.utils.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class UserServiceClientFallback implements UserServiceClient {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceClientFallback.class);


    @Override
    public ApiResponse obtenerCliente(Long clienteId) {
        logger.error("Fallback activado: no se pudo obtener cliente {}", clienteId);
        throw new UserServiceUnavailableException("User Service no disponible - Cliente ID: " + clienteId);
    }

    @Override
    public ApiResponse obtenerClienteIdentificacion(String clienteId) {
        logger.error("Fallback activado: no se pudo obtener cliente {}", clienteId);
        throw new UserServiceUnavailableException("User Service no disponible - identificacion: " + clienteId);
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
