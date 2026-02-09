package com.ntt.user_service.controller;

import com.ntt.user_service.dtos.cliente.ClienteRequestDTO;
import com.ntt.user_service.dtos.cliente.ClienteResponseVo;
import com.ntt.user_service.service.ClienteService;
import com.ntt.user_service.utils.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/clientes")
public class clienteController {
    private final ClienteService clienteService;

    public clienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClienteResponseVo>> create(
            @RequestBody ClienteRequestDTO dto) {

        ClienteResponseVo cliente = clienteService.createCliente(dto);
        return ResponseEntity.ok(
                ApiResponse.success("Cliente creado correctamente", cliente)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClienteResponseVo>>> list() {

        List<ClienteResponseVo> clientes = clienteService.listClientes();
        return ResponseEntity.ok(ApiResponse.success(clientes));
    }

    @GetMapping("/paginated")
    public ResponseEntity<ApiResponse<Page<ClienteResponseVo>>> listPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {

        Page<ClienteResponseVo> clientes =
                clienteService.pageClientes(page, size);

        return ResponseEntity.ok(ApiResponse.success(clientes));
    }

    @GetMapping("/paginated/{identificacion}")
    public ResponseEntity<ApiResponse<Page<ClienteResponseVo>>> pageClientesByIdentificacion(
            @PathVariable String identificacion,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {

        Page<ClienteResponseVo> clientes =
                clienteService.pageClientesByIdentificacion(identificacion,page, size);

        return ResponseEntity.ok(ApiResponse.success(clientes));
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteResponseVo>> get(
            @PathVariable Long id) {

        ClienteResponseVo cliente = clienteService.getCliente(id);
        return ResponseEntity.ok(ApiResponse.success(cliente));
    }

    @GetMapping("/cedula/{identificacion}")
    public ResponseEntity<ApiResponse<ClienteResponseVo>> get(
            @PathVariable String identificacion) {

        ClienteResponseVo cliente = clienteService.getClientebycedula(identificacion);
        return ResponseEntity.ok(ApiResponse.success(cliente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteResponseVo>> update(
            @PathVariable Long id,
            @RequestBody ClienteRequestDTO dto) {

        ClienteResponseVo cliente = clienteService.updateCliente(id, dto);
        return ResponseEntity.ok(
                ApiResponse.success("Cliente actualizado correctamente", cliente)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {

        clienteService.deleteCliente(id);
        return ResponseEntity.ok(
                ApiResponse.success("Cliente eliminado correctamente", null)
        );
    }
}
