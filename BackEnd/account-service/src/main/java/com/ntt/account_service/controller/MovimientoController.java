package com.ntt.account_service.controller;

import com.ntt.account_service.dtos.moviemiento.MovimeintoResponseVo;
import com.ntt.account_service.dtos.moviemiento.MovimientoRequestDTO;
import com.ntt.account_service.service.MovimientoService;
import com.ntt.account_service.utils.ApiResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/movimientos")
@Validated
public class MovimientoController {
    @Autowired
    private MovimientoService movimientoService;

    private static final Logger logger = LoggerFactory.getLogger(MovimientoService.class);

    public MovimientoController(MovimientoService movimientoService) {
        this.movimientoService = movimientoService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MovimeintoResponseVo>> crearMovimiento(
            @RequestBody MovimientoRequestDTO dto) {

        logger.info("Request para crear movimiento recibido: {}", dto);
        MovimeintoResponseVo response = movimientoService.crearMovimiento(dto);

        return ResponseEntity.ok(
                ApiResponse.success("Movimiento creado correctamente", response)
        );
    }

    @GetMapping("/cuenta/{numeroCuenta}")
    public ResponseEntity<ApiResponse<List<MovimeintoResponseVo>>> obtenerPorNumeroCuenta(
            @PathVariable Long numeroCuenta) {

        List<MovimeintoResponseVo> movimientos =
                movimientoService.obtenerPorNumeroCuenta(numeroCuenta);

        return ResponseEntity.ok(ApiResponse.success(movimientos));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MovimeintoResponseVo>>> obtenerTodos() {

        List<MovimeintoResponseVo> movimientos =
                movimientoService.obtenerTodos();

        return ResponseEntity.ok(ApiResponse.success(movimientos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {

        movimientoService.eliminarPorId(id);
        return ResponseEntity.ok(
                ApiResponse.success("Movimiento eliminado correctamente", null)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MovimeintoResponseVo>> actualizarMovimiento(
            @PathVariable Long id,
            @Valid @RequestBody MovimientoRequestDTO dto) {

        MovimeintoResponseVo response =
                movimientoService.actualizarMovimiento(id, dto);

        return ResponseEntity.ok(
                ApiResponse.success("Movimiento actualizado correctamente", response)
        );
    }
}