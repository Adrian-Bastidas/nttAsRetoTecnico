package com.ntt.account_service.service;

import com.ntt.account_service.dtos.cliente.ClienteVo;
import com.ntt.account_service.utils.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "user-service",
        url = "${user-service.url}",
        fallback = UserServiceClientFallback.class
)
public interface UserServiceClient {
    @GetMapping("/clientes/{clienteId}")
    ApiResponse obtenerCliente(@PathVariable("clienteId") Long clienteId);

    @GetMapping("/clientes/cedula/{identificacion}")
    ApiResponse obtenerClienteIdentificacion(@PathVariable("identificacion") String identificacion);

    @PutMapping("/api/clientes/{clienteId}/activar")
    void activarCliente(@PathVariable("clienteId") Long clienteId);

    @PostMapping("/api/clientes/{clienteId}/notificar-cuenta")
    void notificarCuentaCreada(@PathVariable("clienteId") Long clienteId, @RequestBody Long cuentaId);
}
