package com.ntt.account_service.controller;

import com.ntt.account_service.dtos.cuenta.CuentaRequestDTO;
import com.ntt.account_service.dtos.cuenta.CuentaResponseVo;
import com.ntt.account_service.dtos.cuenta.EstadoCuentaReporteVO;
import com.ntt.account_service.service.CuentaService;
import com.ntt.account_service.utils.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/cuentas")
@Validated
public class CuentaController {
    @Autowired
    private CuentaService cuentaService;

    @PostMapping
    public ResponseEntity<ApiResponse<CuentaResponseVo>> crearCuenta(
            @Valid @RequestBody CuentaRequestDTO cuentaDTO) {

        CuentaResponseVo cuentaCreada = cuentaService.crearCuenta(cuentaDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Cuenta creada correctamente", cuentaCreada));
    }

    @GetMapping("/{cuentaId}")
    public ResponseEntity<ApiResponse<CuentaResponseVo>> obtenerCuenta(
            @PathVariable Long cuentaId) {

        CuentaResponseVo cuenta = cuentaService.obtenerCuenta(cuentaId);
        return ResponseEntity.ok(ApiResponse.success(cuenta));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<ApiResponse<List<CuentaResponseVo>>> obtenerCuentasPorCliente(
            @PathVariable Long clienteId) {

        List<CuentaResponseVo> cuentas = cuentaService.obtenerCuentasPorCliente(clienteId);
        return ResponseEntity.ok(ApiResponse.success(cuentas));
    }

    @GetMapping("/pageable")
    public ResponseEntity<ApiResponse<Page<CuentaResponseVo>>> obtenerCuentas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size ){

        Page<CuentaResponseVo> cuentas = cuentaService.obtenerAllCuentas(page,size);
        return ResponseEntity.ok(ApiResponse.success(cuentas));
    }

    @GetMapping("/pageable/cedula/{identificacion}")
    public ResponseEntity<ApiResponse<Page<CuentaResponseVo>>> obtenerCuentasByIdPageable(
            @PathVariable String identificacion,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<CuentaResponseVo> cuentas =
                cuentaService.obtenerCuentasPorClienteIdentificacionPageable(
                        identificacion,
                        page,
                        size
                );

        return ResponseEntity.ok(ApiResponse.success(cuentas));
    }


    @GetMapping("/cliente/cedula/{identificacion}")
    public ResponseEntity<ApiResponse<List<CuentaResponseVo>>> obtenerCuentasPorCliente(
            @PathVariable String identificacion) {

        List<CuentaResponseVo> cuentas = cuentaService.obtenerCuentasPorClienteIdentificacion(identificacion);
        return ResponseEntity.ok(ApiResponse.success(cuentas));
    }

    @DeleteMapping("/{cuentaId}")
    public ResponseEntity<ApiResponse<Void>> desactivarCuenta(
            @PathVariable Long cuentaId) {

        cuentaService.desactivarCuenta(cuentaId);
        return ResponseEntity.ok(
                ApiResponse.success("Cuenta desactivada correctamente", null)
        );
    }

    @GetMapping("/reportes/estado-cuenta")
    public ResponseEntity<ApiResponse<List<EstadoCuentaReporteVO>>> generarReporteEstadoCuenta(
            @RequestParam Long clienteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date hasta) {

        List<EstadoCuentaReporteVO> reporte =
                cuentaService.generarReporte(clienteId, desde, hasta);

        return ResponseEntity.ok(ApiResponse.success(reporte));
    }

    @PutMapping("/{cuentaId}")
    public ResponseEntity<ApiResponse<CuentaResponseVo>> actualizarCuenta(
            @PathVariable Long cuentaId,
            @Valid @RequestBody CuentaRequestDTO cuentaDTO) {

        CuentaResponseVo cuentaActualizada =
                cuentaService.actualizarCuenta(cuentaId, cuentaDTO);

        return ResponseEntity.ok(
                ApiResponse.success("Cuenta actualizada correctamente", cuentaActualizada)
        );
    }

    @GetMapping("/numero/{numerocuenta}")
    public ResponseEntity<ApiResponse<CuentaResponseVo>> obtenerCuentaBynumero(
            @PathVariable String numerocuenta) {

        CuentaResponseVo cuenta = cuentaService.obtenerCuentaByMovimiento(numerocuenta);
        return ResponseEntity.ok(ApiResponse.success(cuenta));
    }

}
