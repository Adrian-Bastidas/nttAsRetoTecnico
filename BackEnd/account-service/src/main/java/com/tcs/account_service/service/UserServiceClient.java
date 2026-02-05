package com.tcs.account_service.service;

import com.tcs.account_service.dtos.cliente.ClienteVo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "user-service",
        url = "${user-service.url}",
        fallback = UserServiceClientFallback.class
)
public interface UserServiceClient {
    @GetMapping("/clientes/{clienteId}")
    ClienteVo obtenerCliente(@PathVariable("clienteId") Long clienteId);

    @PutMapping("/api/clientes/{clienteId}/activar")
    void activarCliente(@PathVariable("clienteId") Long clienteId);

    @PostMapping("/api/clientes/{clienteId}/notificar-cuenta")
    void notificarCuentaCreada(@PathVariable("clienteId") Long clienteId, @RequestBody Long cuentaId);
}
