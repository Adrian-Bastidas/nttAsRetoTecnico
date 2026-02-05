package com.tcs.account_service.controller;

import com.tcs.account_service.dtos.cuenta.CuentaRequestDTO;
import com.tcs.account_service.dtos.cuenta.CuentaResponseVo;
import com.tcs.account_service.dtos.cuenta.EstadoCuentaReporteVO;
import com.tcs.account_service.service.CuentaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/cuentas")
@Validated
public class CuentaController {
    @Autowired
    private CuentaService cuentaService;

    @PostMapping
    public ResponseEntity<CuentaResponseVo> crearCuenta(@Valid @RequestBody CuentaRequestDTO cuentaDTO) {
        CuentaResponseVo cuentaCreada = cuentaService.crearCuenta(cuentaDTO);
        return new ResponseEntity<>(cuentaCreada, HttpStatus.CREATED);
    }

    @GetMapping("/{cuentaId}")
    public ResponseEntity<CuentaResponseVo> obtenerCuenta(@PathVariable Long cuentaId) {
        CuentaResponseVo cuenta = cuentaService.obtenerCuenta(cuentaId);
        return ResponseEntity.ok(cuenta);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<CuentaResponseVo>> obtenerCuentasPorCliente(@PathVariable Long clienteId) {
        List<CuentaResponseVo> cuentas = cuentaService.obtenerCuentasPorCliente(clienteId);
        return ResponseEntity.ok(cuentas);
    }

    @DeleteMapping("/{cuentaId}")
    public ResponseEntity<Void> desactivarCuenta(@PathVariable Long cuentaId) {
        cuentaService.desactivarCuenta(cuentaId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/reportes/estado-cuenta")
    public ResponseEntity<List<EstadoCuentaReporteVO>> generarReporteEstadoCuenta(
            @RequestParam Long clienteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date hasta) {

        List<EstadoCuentaReporteVO> reporte = cuentaService.generarReporte(clienteId, desde, hasta);
        return ResponseEntity.ok(reporte);
    }
    @PutMapping("/{cuentaId}")
    public ResponseEntity<CuentaResponseVo> actualizarCuenta(
            @PathVariable Long cuentaId,
            @Valid @RequestBody CuentaRequestDTO cuentaDTO) {
        CuentaResponseVo cuentaActualizada = cuentaService.actualizarCuenta(cuentaId, cuentaDTO);
        return ResponseEntity.ok(cuentaActualizada);
    }

}
