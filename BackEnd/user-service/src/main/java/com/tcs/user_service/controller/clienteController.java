package com.tcs.user_service.controller;

import com.tcs.user_service.dtos.cliente.ClienteRequestDTO;
import com.tcs.user_service.dtos.cliente.ClienteResponseVo;
import com.tcs.user_service.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class clienteController {
    private final ClienteService clienteService;

    public clienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<ClienteResponseVo> create(@RequestBody ClienteRequestDTO dto) {
        return ResponseEntity.ok(clienteService.createCliente(dto));
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponseVo>> list() {
        return ResponseEntity.ok(clienteService.listClientes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseVo> get(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.getCliente(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseVo> update(@PathVariable Long id, @RequestBody ClienteRequestDTO dto) {
        return ResponseEntity.ok(clienteService.updateCliente(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clienteService.deleteCliente(id);
        return ResponseEntity.noContent().build();
    }
}
