package com.tcs.account_service.controller;

import com.tcs.account_service.dtos.moviemiento.MovimeintoResponseVo;
import com.tcs.account_service.dtos.moviemiento.MovimientoRequestDTO;
import com.tcs.account_service.service.MovimientoService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<MovimeintoResponseVo> crearMovimiento(@RequestBody MovimientoRequestDTO dto) {
        logger.info("Request para crear movimiento recibido: {}", dto);
        MovimeintoResponseVo response = movimientoService.crearMovimiento(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cuenta/{numeroCuenta}")
    public ResponseEntity<List<MovimeintoResponseVo>> obtenerPorNumeroCuenta(@PathVariable Long numeroCuenta) {
        return ResponseEntity.ok(movimientoService.obtenerPorNumeroCuenta(numeroCuenta));
    }

    @GetMapping
    public ResponseEntity<List<MovimeintoResponseVo>> obtenerTodos() {
        return ResponseEntity.ok(movimientoService.obtenerTodos());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        movimientoService.eliminarPorId(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<MovimeintoResponseVo> actualizarMovimiento(
            @PathVariable Long id,
            @Valid @RequestBody MovimientoRequestDTO dto) {
        MovimeintoResponseVo response = movimientoService.actualizarMovimiento(id, dto);
        return ResponseEntity.ok(response);
    }
}