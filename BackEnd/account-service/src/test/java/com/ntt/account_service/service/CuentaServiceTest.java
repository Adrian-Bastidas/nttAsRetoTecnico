package com.ntt.account_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ntt.account_service.dtos.cliente.ClienteVo;
import com.ntt.account_service.dtos.cuenta.CuentaRequestDTO;
import com.ntt.account_service.dtos.cuenta.CuentaResponseVo;
import com.ntt.account_service.exception.ClienteNoEncontradoException;
import com.ntt.account_service.exception.CuentaNoEncontradaException;
import com.ntt.account_service.mappers.CuentaMapper;
import com.ntt.account_service.model.Cuenta;
import com.ntt.account_service.repository.CuentaRepository;
import com.ntt.account_service.repository.MovimientoRepository;
import com.ntt.account_service.utils.ApiResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CuentaServiceTest {

    @Mock
    private CuentaRepository cuentaRepository;
    @Mock
    private UserServiceClient userServiceClient;
    @Mock
    private CuentaMapper cuentaMapper;
    @Mock
    private ObjectMapper objectMapper;
    @Mock
    private MovimientoRepository movimientoRepository;
    @Mock
    private ReportePdfService reportePdfService;

    @InjectMocks
    private CuentaService cuentaService;

    @Test
    void crearCuenta_deberiaCrearCuentaCorrectamente() {
        // Arrange
        CuentaRequestDTO dto = new CuentaRequestDTO();
        dto.setClienteId(1L);

        ClienteVo cliente = new ClienteVo();
        cliente.setClienteId(1L);

        ApiResponse<Object> response = new ApiResponse<>();
        response.setData(cliente);

        Cuenta cuenta = new Cuenta();
        cuenta.setCuentaId(10L);

        CuentaResponseVo responseVo = new CuentaResponseVo();

        when(userServiceClient.obtenerCliente(1L)).thenReturn(response);
        when(objectMapper.convertValue(any(), eq(ClienteVo.class))).thenReturn(cliente);
        when(cuentaMapper.dtoToEntity(dto)).thenReturn(cuenta);
        when(cuentaRepository.existsByNumeroCuenta(any())).thenReturn(false);
        when(cuentaRepository.save(any())).thenReturn(cuenta);
        when(cuentaMapper.entityToVO(cuenta)).thenReturn(responseVo);

        // Act
        CuentaResponseVo result = cuentaService.crearCuenta(dto);

        // Assert
        assertNotNull(result);
        verify(cuentaRepository).save(any());
        verify(userServiceClient).notificarCuentaCreada(1L, 10L);
    }

    @Test
    void crearCuenta_clienteNoExiste_deberiaLanzarExcepcion() {
        CuentaRequestDTO dto = new CuentaRequestDTO();
        dto.setClienteId(1L);

        when(userServiceClient.obtenerCliente(1L))
                .thenThrow(new RuntimeException("error feign"));

        assertThrows(
                ClienteNoEncontradoException.class,
                () -> cuentaService.crearCuenta(dto)
        );
    }

    @Test
    void obtenerCuenta_cuentaNoExiste_deberiaLanzarExcepcion() {
        when(cuentaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(
                CuentaNoEncontradaException.class,
                () -> cuentaService.obtenerCuenta(99L)
        );
    }

    @Test
    void desactivarCuenta_deberiaCambiarEstado() {
        Cuenta cuenta = new Cuenta();
        cuenta.setEstado(true);

        when(cuentaRepository.findById(1L)).thenReturn(Optional.of(cuenta));

        cuentaService.desactivarCuenta(1L);

        assertFalse(cuenta.getEstado());
        verify(cuentaRepository).save(cuenta);
    }

    @Test
    void generarReportePdf_deberiaGenerarBytes() throws Exception {
        ClienteVo cliente = new ClienteVo();
        ApiResponse<Object> response = new ApiResponse<>();
        response.setData(cliente);

        when(userServiceClient.obtenerCliente(1L)).thenReturn(response);
        when(objectMapper.convertValue(any(), eq(ClienteVo.class))).thenReturn(cliente);
        when(reportePdfService.generarReportePdf(any(), any(), any(), any()))
                .thenReturn(new byte[]{1, 2, 3});

        byte[] result = cuentaService.generarReportePdf(1L, new Date(), new Date());

        assertNotNull(result);
        assertEquals(3, result.length);
    }
}
