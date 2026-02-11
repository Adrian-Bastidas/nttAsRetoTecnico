package com.ntt.account_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ntt.account_service.dtos.cliente.ClienteVo;
import com.ntt.account_service.dtos.cuenta.CuentaRequestDTO;
import com.ntt.account_service.dtos.cuenta.CuentaResponseVo;
import com.ntt.account_service.dtos.cuenta.EstadoCuentaReporteVO;
import com.ntt.account_service.exception.ClienteNoEncontradoException;
import com.ntt.account_service.exception.CuentaNoEncontradaException;
import com.ntt.account_service.mappers.CuentaMapper;
import com.ntt.account_service.model.Cuenta;
import com.ntt.account_service.model.Movimiento;
import com.ntt.account_service.repository.CuentaRepository;
import com.ntt.account_service.repository.MovimientoRepository;
import com.ntt.account_service.utils.ApiResponse;
import feign.FeignException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;


import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CuentaService {
    @Autowired
    private CuentaRepository cuentaRepository;

    @Autowired
    private UserServiceClient userServiceClient;

    @Autowired
    private CuentaMapper cuentaMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private final SecureRandom random = new SecureRandom();
    private static final Logger logger = LoggerFactory.getLogger(CuentaService.class);
    @Autowired
    private MovimientoRepository movimientoRepository;
    @Autowired
    private ReportePdfService reportePdfService;


    @Transactional
    public CuentaResponseVo crearCuenta(CuentaRequestDTO cuentaDTO) {
        logger.info("Iniciando creación de cuenta para cliente ID: {}", cuentaDTO.getClienteId());

        ClienteVo cliente;
        try {

            ApiResponse<?> response = userServiceClient.obtenerCliente(cuentaDTO.getClienteId());

            cliente = objectMapper.convertValue(
                    response.getData(),
                    ClienteVo.class
            );
            if (cliente == null) {
                logger.warn("Cliente con ID {} no encontrado", cuentaDTO.getClienteId());
                throw new ClienteNoEncontradoException("Cliente con ID " + cuentaDTO.getClienteId() + " no encontrado");
            }
            logger.info("Cliente encontrado: {}", cliente.getClienteId());
        } catch (Exception e) {
            logger.error("Error al verificar cliente: {}", e.getMessage(), e);
            throw new ClienteNoEncontradoException("Error al verificar cliente: " + e.getMessage());
        }


        Cuenta cuenta = cuentaMapper.dtoToEntity(cuentaDTO);
        cuenta.setNumeroCuenta(generarNumeroCuenta());
        logger.debug("Número de cuenta generado: {}", cuenta.getNumeroCuenta());

        cuenta = cuentaRepository.save(cuenta);
        logger.info("Cuenta guardada con ID: {}", cuenta.getCuentaId());

        try {
            userServiceClient.notificarCuentaCreada(cliente.getClienteId(), cuenta.getCuentaId());
            logger.info("Notificación enviada a user-service para cliente ID: {}", cliente.getClienteId());
        } catch (Exception e) {
            logger.warn("Error al notificar creación de cuenta: {}", e.getMessage(), e);
        }

        CuentaResponseVo cuentaVO = cuentaMapper.entityToVO(cuenta);
        cuentaVO.setCliente(cliente);

        logger.info("Cuenta creada exitosamente: {}", cuentaVO.getCuentaId());
        return cuentaVO;
    }

    public CuentaResponseVo obtenerCuenta(Long cuentaId) {
        logger.info("Buscando cuenta con ID: {}", cuentaId);
        Cuenta cuenta = cuentaRepository.findById(cuentaId)
                .orElseThrow(() -> {
                    logger.warn("Cuenta con ID {} no encontrada", cuentaId);
                    return new CuentaNoEncontradaException("Cuenta no encontrada");
                });

        CuentaResponseVo cuentaVO = cuentaMapper.entityToVO(cuenta);

        try {

            ApiResponse<?> response = userServiceClient.obtenerCliente(cuenta.getClienteId());

            ClienteVo cliente = objectMapper.convertValue(
                    response.getData(),
                    ClienteVo.class
            );

            cuentaVO.setCliente(cliente);
            logger.info("Información de cliente agregada a cuenta ID: {}", cuentaId);
        } catch (Exception e) {
            logger.warn("Error al obtener información del cliente para cuenta {}: {}", cuentaId, e.getMessage());
        }

        return cuentaVO;
    }

    public CuentaResponseVo obtenerCuentaByMovimiento(String numerocuenta) {
        logger.info("Buscando cuenta con número: {}", numerocuenta);
        Cuenta cuenta = cuentaRepository.findByNumeroCuenta(numerocuenta)
                .orElseThrow(() -> {
                    logger.warn("Cuenta con número {} no encontrada", numerocuenta);
                    return new CuentaNoEncontradaException("Cuenta no encontrada");
                });

        CuentaResponseVo cuentaVO = cuentaMapper.entityToVO(cuenta);

        try {

            ApiResponse<?> response = userServiceClient.obtenerCliente(cuenta.getClienteId());

            ClienteVo cliente = objectMapper.convertValue(
                    response.getData(),
                    ClienteVo.class
            );

            cuentaVO.setCliente(cliente);
            logger.info("Información de cliente agregada a cuenta número: {}", numerocuenta);
        } catch (Exception e) {
            logger.warn("Error al obtener información del cliente para cuenta {}: {}", numerocuenta, e.getMessage());
        }

        return cuentaVO;
    }

    public List<CuentaResponseVo> obtenerCuentasPorCliente(Long clienteId) {
        logger.info("Buscando cuentas activas para cliente ID: {}", clienteId);
        try {
            ApiResponse<?> response = userServiceClient.obtenerCliente(clienteId);

            ClienteVo cliente = objectMapper.convertValue(
                    response.getData(),
                    ClienteVo.class
            );

            if (cliente == null) {
                logger.warn("Cliente con ID {} no encontrado", clienteId);
                throw new ClienteNoEncontradoException("Cliente no encontrado");
            }

            List<Cuenta> cuentas = cuentaRepository.findByClienteIdAndEstado(clienteId, true);
            logger.info("Se encontraron {} cuentas activas para el cliente {}", cuentas.size(), clienteId);

            return cuentas.stream()
                    .map(cuenta -> {
                        CuentaResponseVo vo = cuentaMapper.entityToVO(cuenta);
                        vo.setCliente(cliente);
                        return vo;
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            logger.error("Error al obtener cuentas del cliente {}: {}", clienteId, e.getMessage(), e);
            throw new ClienteNoEncontradoException("Error al obtener cuentas del cliente: " + e.getMessage());
        }
    }
    public Page<CuentaResponseVo> obtenerCuentasPorClienteIdentificacionPageable(
            String identificacion,
            int page,
            int size
    ) {
        logger.info("Buscando cuentas paginadas para cliente {}", identificacion);

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);

        Pageable pageable = PageRequest.of(safePage, safeSize);

        ClienteVo cliente;

        try {
            ApiResponse<?> response =
                    userServiceClient.obtenerClienteIdentificacion(identificacion);

            cliente = objectMapper.convertValue(
                    response.getData(),
                    ClienteVo.class
            );

        } catch (FeignException.NotFound e) {
            logger.info("Cliente no encontrado con identificacion {}", identificacion);
            return Page.empty(pageable);
        }

        if (cliente == null) {
            return Page.empty(pageable);
        }

        Page<Cuenta> cuentasPage =
                cuentaRepository.findByClienteIdAndEstado(
                        cliente.getClienteId(),
                        true,
                        pageable
                );

        if (cuentasPage.isEmpty()) {
            return Page.empty(pageable);
        }

        return cuentasPage.map(cuenta -> {
            CuentaResponseVo vo = cuentaMapper.entityToVO(cuenta);
            vo.setCliente(cliente);
            return vo;
        });
    }




    public List<CuentaResponseVo> obtenerCuentasPorClienteIdentificacion(String identificacion) {
        logger.info("Buscando cuentas activas para cliente identificacion: {}", identificacion);
        try {
            ApiResponse<?> response =
                    userServiceClient.obtenerClienteIdentificacion(identificacion);

            ClienteVo cliente = objectMapper.convertValue(
                    response.getData(),
                    ClienteVo.class
            );
            logger.info("cliente {}", cliente);
            if (cliente == null) {
                logger.warn("Cliente con ID {} no encontrado", identificacion);
                throw new ClienteNoEncontradoException("Cliente no encontrado");
            }logger.info("cliente {}", cliente.getClienteId());

            List<Cuenta> cuentas = cuentaRepository.findByClienteIdAndEstado(cliente.getClienteId(), true);
            logger.info("Se encontraron {} cuentas activas para el cliente {}", cuentas.size(), identificacion);

            return cuentas.stream()
                    .map(cuenta -> {
                        CuentaResponseVo vo = cuentaMapper.entityToVO(cuenta);
                        vo.setCliente(cliente);
                        return vo;
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            logger.error("Error al obtener cuentas del cliente {}: {}", identificacion, e.getMessage(), e);
            throw new ClienteNoEncontradoException("Error al obtener cuentas del cliente: " + e.getMessage());
        }
    }

    @Transactional
    public void desactivarCuenta(Long cuentaId) {
        logger.info("Desactivando cuenta con ID: {}", cuentaId);
        Cuenta cuenta = cuentaRepository.findById(cuentaId)
                .orElseThrow(() -> {
                    logger.warn("Cuenta con ID {} no encontrada para desactivación", cuentaId);
                    return new CuentaNoEncontradaException("Cuenta no encontrada");
                });

        cuenta.setEstado(false);
        cuentaRepository.save(cuenta);
        logger.info("Cuenta desactivada correctamente: {}", cuentaId);
    }

    private String generarNumeroCuenta() {
        String numeroCuenta;
        do {
            numeroCuenta = "ACC" + String.format("%010d", Math.abs(random.nextLong()) % 10000000000L);
        } while (cuentaRepository.existsByNumeroCuenta(numeroCuenta));
        logger.debug("Número de cuenta único generado: {}", numeroCuenta);
        return numeroCuenta;
    }

    public List<EstadoCuentaReporteVO> generarReporte(Long clienteId, Date desde, Date hasta) {
        logger.info("Generando reporte de estado de cuenta para cliente ID: {}", clienteId);

        ClienteVo cliente;
        try {

            ApiResponse<?> response = userServiceClient.obtenerCliente(clienteId);

            cliente = objectMapper.convertValue(
                    response.getData(),
                    ClienteVo.class
            );

            if (cliente == null) {
                logger.warn("Cliente con ID {} no encontrado", clienteId);
                throw new ClienteNoEncontradoException("Cliente con ID " + clienteId + " no encontrado");
            }
            logger.info("Cliente obtenido: {}", cliente.getClienteId());
        } catch (Exception e) {
            logger.error("Error al obtener cliente por Feign: {}", e.getMessage(), e);
            throw new ClienteNoEncontradoException("Error al obtener cliente: " + e.getMessage());
        }

        List<Cuenta> cuentas = cuentaRepository.findByClienteId(clienteId);
        List<EstadoCuentaReporteVO> resultado = new ArrayList<>();

        for (Cuenta cuenta : cuentas) {
            List<Movimiento> movimientos = movimientoRepository
                    .findByCuentaIdAndFechaBetweenOrderByFechaAsc(cuenta.getCuentaId(), desde, hasta);

            logger.info("Movimientos encontrados para cuenta {}: {}", cuenta.getNumeroCuenta(), movimientos.size());

            if (movimientos.isEmpty()) {
                logger.info("No hay movimientos para la cuenta {}", cuenta.getNumeroCuenta());
                continue;
            }

            double saldoAntes = cuenta.getSaldoInicial();
            for (Movimiento movimiento : movimientos) {
                double saldoDisponible = saldoAntes + movimiento.getValor();

                EstadoCuentaReporteVO vo = new EstadoCuentaReporteVO(
                        movimiento.getFecha(),
                        cliente.getNombre(),
                        cuenta.getNumeroCuenta(),
                        cuenta.getTipoCuenta(),
                        cuenta.getSaldoInicial(),
                        cuenta.getEstado(),
                        movimiento.getValor(),
                        saldoDisponible
                );

                resultado.add(vo);
                saldoAntes = saldoDisponible;
            }
        }

        return resultado;
    }

    public Page<EstadoCuentaReporteVO> generarReportePage(Long clienteId, Date desde, Date hasta, int page, int size) {
        logger.info("Generando reporte de estado de cuenta para cliente ID: {}", clienteId);

        ClienteVo cliente;
        try {
            ApiResponse<?> response = userServiceClient.obtenerCliente(clienteId);

            cliente = objectMapper.convertValue(
                    response.getData(),
                    ClienteVo.class
            );

            if (cliente == null) {
                logger.warn("Cliente con ID {} no encontrado", clienteId);
                throw new ClienteNoEncontradoException("Cliente con ID " + clienteId + " no encontrado");
            }
            logger.info("Cliente obtenido: {}", cliente.getClienteId());
        } catch (Exception e) {
            logger.error("Error al obtener cliente por Feign: {}", e.getMessage(), e);
            throw new ClienteNoEncontradoException("Error al obtener cliente: " + e.getMessage());
        }

        List<Cuenta> cuentas = cuentaRepository.findByClienteId(clienteId);

        if (cuentas.isEmpty()) {
            logger.warn("No se encontraron cuentas para el cliente {}", clienteId);
            return new PageImpl<>(new ArrayList<>(), PageRequest.of(page, size), 0);
        }

        // Obtener los IDs de las cuentas
        List<Long> cuentaIds = cuentas.stream().map(Cuenta::getCuentaId).collect(Collectors.toList());

        // Obtener movimientos paginados desde la BD
        Pageable pageable = PageRequest.of(page, size, Sort.by("fecha").ascending());
        Page<Movimiento> movimientosPage = movimientoRepository
                .findByCuentaIdInAndFechaBetween(cuentaIds, desde, hasta, pageable);

        logger.info("Movimientos encontrados: {}", movimientosPage.getTotalElements());

        // Mapear a VO
        List<EstadoCuentaReporteVO> resultado = movimientosPage.getContent().stream()
                .map(movimiento -> {
                    Cuenta cuenta = cuentas.stream()
                            .filter(c -> c.getCuentaId().equals(movimiento.getCuenta().getCuentaId()))
                            .findFirst()
                            .orElse(null);

                    return new EstadoCuentaReporteVO(
                            movimiento.getFecha(),
                            cliente.getNombre(),
                            cuenta.getNumeroCuenta(),
                            cuenta.getTipoCuenta(),
                            cuenta.getSaldoInicial(),
                            cuenta.getEstado(),
                            movimiento.getValor(),
                            movimiento.getSaldo()
                    );
                })
                .collect(Collectors.toList());

        return new PageImpl<>(resultado, movimientosPage.getPageable(), movimientosPage.getTotalElements());
    }
    @Transactional
    public CuentaResponseVo actualizarCuenta(Long cuentaId, CuentaRequestDTO cuentaDTO) {
        logger.info("Actualizando cuenta con ID: {}", cuentaId);

        Cuenta cuenta = cuentaRepository.findById(cuentaId)
                .orElseThrow(() -> {
                    logger.warn("Cuenta con ID {} no encontrada para actualización", cuentaId);
                    return new CuentaNoEncontradaException("Cuenta no encontrada");
                });

        ClienteVo cliente;
        try {

            ApiResponse<?> response = userServiceClient.obtenerCliente(cuentaDTO.getClienteId());

            cliente = objectMapper.convertValue(
                    response.getData(),
                    ClienteVo.class
            );
            if (cliente == null) {
                logger.warn("Cliente con ID {} no encontrado", cuentaDTO.getClienteId());
                throw new ClienteNoEncontradoException("Cliente con ID " + cuentaDTO.getClienteId() + " no encontrado");
            }
        } catch (Exception e) {
            logger.error("Error al verificar cliente: {}", e.getMessage(), e);
            throw new ClienteNoEncontradoException("Error al verificar cliente: " + e.getMessage());
        }

        cuenta.setClienteId(cuentaDTO.getClienteId());
        cuenta.setTipoCuenta(cuentaDTO.getTipoCuenta());

        cuenta = cuentaRepository.save(cuenta);
        logger.info("Cuenta actualizada correctamente con ID: {}", cuenta.getCuentaId());

        CuentaResponseVo cuentaVO = cuentaMapper.entityToVO(cuenta);
        cuentaVO.setCliente(cliente);
        return cuentaVO;
    }
    public Page<CuentaResponseVo> obtenerAllCuentas(int page, int size) {
        logger.info("Buscando cuentas paginadas...");

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);

        Pageable pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by("cuentaId").ascending()
        );

        Page<Cuenta> cuentasPage = cuentaRepository.findByEstado(true, pageable);

        logger.info(
                "Consultando cuentas paginadas: page={}, size={}, elementos={}",
                safePage,
                safeSize,
                cuentasPage.getNumberOfElements()
        );

        List<CuentaResponseVo> cuentasVOList = cuentasPage.stream()
                .map(cuenta -> {
                    CuentaResponseVo vo = cuentaMapper.entityToVO(cuenta);

                    try {
                        ApiResponse<?> response =
                                userServiceClient.obtenerCliente(cuenta.getClienteId());

                        ClienteVo cliente = objectMapper.convertValue(
                                response.getData(),
                                ClienteVo.class
                        );
                        vo.setCliente(cliente);

                    } catch (FeignException.NotFound e) {
                        logger.info(
                                "Cliente no encontrado para cuenta ID {}, clienteId={}",
                                cuenta.getCuentaId(),
                                cuenta.getClienteId()
                        );
                        vo.setCliente(null);

                    } catch (Exception e) {
                        logger.error(
                                "Error al obtener cliente para cuenta ID {}: {}",
                                cuenta.getCuentaId(),
                                e.getMessage(),
                                e
                        );
                        vo.setCliente(null);
                    }

                    return vo;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(
                cuentasVOList,
                pageable,
                cuentasPage.getTotalElements()
        );
    }

    public byte[] generarReportePdf(Long clienteId, Date desde, Date hasta) throws Exception {
        logger.info("Generando PDF de reporte para cliente ID: {}", clienteId);

        // Obtener los datos del reporte
        List<EstadoCuentaReporteVO> reportes = generarReporte(clienteId, desde, hasta);

        // Obtener datos del cliente
        ClienteVo cliente;
        try {
            ApiResponse<?> response = userServiceClient.obtenerCliente(clienteId);
            cliente = objectMapper.convertValue(response.getData(), ClienteVo.class);
        } catch (Exception e) {
            logger.error("Error al obtener cliente para PDF: {}", e.getMessage());
            throw new ClienteNoEncontradoException("Error al obtener cliente: " + e.getMessage());
        }

        // Generar PDF
        byte[] pdfBytes = reportePdfService.generarReportePdf(reportes, cliente, desde, hasta);
        logger.info("PDF generado exitosamente, tamaño: {} bytes", pdfBytes.length);

        return pdfBytes;
    }
}
