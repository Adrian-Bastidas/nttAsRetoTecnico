package com.ntt.account_service.service;

import com.ntt.account_service.dtos.moviemiento.MovimeintoResponseVo;
import com.ntt.account_service.dtos.moviemiento.MovimientoRequestDTO;
import com.ntt.account_service.exception.CuentaNoEncontradaException;
import com.ntt.account_service.exception.DiferentesTiposException;
import com.ntt.account_service.exception.MovimientoNoEncontradoException;
import com.ntt.account_service.exception.SaldoInsuficiente;
import com.ntt.account_service.mappers.MovimientoMapper;
import com.ntt.account_service.model.Cuenta;
import com.ntt.account_service.model.Movimiento;
import com.ntt.account_service.repository.CuentaRepository;
import com.ntt.account_service.repository.MovimientoRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class MovimientoService {

    private static final Logger logger = LoggerFactory.getLogger(MovimientoService.class);

    @Autowired
    private MovimientoRepository movimientoRepository;

    @Autowired
    private CuentaRepository cuentaRepository;

    public MovimientoService(MovimientoRepository movimientoRepository) {
        this.movimientoRepository = movimientoRepository;
    }

    @Transactional
    public MovimeintoResponseVo crearMovimiento(MovimientoRequestDTO dto) {
        logger.info("Iniciando creación de movimiento para cuenta: {}", dto.getNumeroCuenta());

        Cuenta cuenta = cuentaRepository.findByNumeroCuenta(dto.getNumeroCuenta())
                .orElseThrow(() ->
                        new CuentaNoEncontradaException("Cuenta no encontrada con número: " + dto.getNumeroCuenta())
                );

        if (!Objects.equals(cuenta.getTipoCuenta(), dto.getTipo())) {
            logger.warn("El tipo de cuenta registrado no coincide con la del movimiento: {}", dto.getTipo());
            throw new DiferentesTiposException("Se está tratando de realizar un movimiento de tipo " +
                    dto.getTipo() + " en una cuenta de tipo " + cuenta.getTipoCuenta());
        }

        Long saldoActual = movimientoRepository
                .findTopByCuentaIdOrderByFechaDesc(cuenta.getCuentaId())
                .map(Movimiento::getSaldo)
                .orElse(cuenta.getSaldoInicial());

        Long nuevoSaldo = saldoActual + dto.getValor();

        if (nuevoSaldo < 0) {
            logger.warn("Saldo insuficiente. Saldo actual: {}, Movimiento solicitado: {}", saldoActual, dto.getValor());
            throw new SaldoInsuficiente("Saldo insuficiente para realizar el movimiento");
        }

        Movimiento movimiento = MovimientoMapper.toEntity(dto);
        movimiento.setCuenta(cuenta);
        movimiento.setSaldo(nuevoSaldo);
        movimiento.setFecha(new Date());

        Movimiento guardado = movimientoRepository.save(movimiento);

        logger.info("Movimiento guardado con ID {} para cuenta {}", guardado.getMovimientoId(), cuenta.getNumeroCuenta());
        logger.info("Nuevo saldo de la cuenta: {}", nuevoSaldo);

        return MovimientoMapper.toVo(guardado);
    }

    public List<MovimeintoResponseVo> obtenerPorNumeroCuenta(String numeroCuenta) {
        logger.info("Buscando movimientos para número de cuenta: {}", numeroCuenta);

        try {
            List<Movimiento> movimientos = movimientoRepository.findByNumeroCuenta(numeroCuenta);

            if (movimientos.isEmpty()) {
                logger.warn("No se encontraron movimientos para la cuenta: {}", numeroCuenta);
                throw new MovimientoNoEncontradoException("No hay movimientos registrados para esta cuenta");
            }

            return movimientos.stream()
                    .map(MovimientoMapper::toVo)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            logger.error("Error al obtener movimientos por cuenta: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Page<MovimeintoResponseVo> obtenerPorNumeroCuentaPaginado(String numeroCuenta, int page, int size) {
        logger.info("Buscando movimientos paginados para número de cuenta: {}", numeroCuenta);

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);

        try {
            Pageable pageable = PageRequest.of(
                    safePage,
                    safeSize,
                    Sort.by("movimientoId").ascending()
            );

            logger.info("Consultando movimientos paginados: page={}, size={}", safePage, safeSize);

            Page<Movimiento> movimientos = movimientoRepository.findByNumeroCuenta(numeroCuenta, pageable);

            if (movimientos.isEmpty()) {
                logger.info("No se encontraron movimientos para cuenta={} page={} size={}",
                        numeroCuenta, safePage, safeSize);
                return Page.empty(pageable);
            }

            return movimientos.map(MovimientoMapper::toVo);

        } catch (Exception e) {
            logger.error("Error al obtener movimientos por cuenta: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<MovimeintoResponseVo> obtenerTodos() {
        logger.info("Obteniendo todos los movimientos");

        try {
            List<Movimiento> movimientos = movimientoRepository.findAll();

            logger.info("Se encontraron {} movimientos", movimientos.size());

            return movimientos.stream()
                    .map(MovimientoMapper::toVo)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            logger.error("Error al obtener movimientos: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Page<MovimeintoResponseVo> obtenerTodosPaginado(int page, int size) {
        logger.info("Obteniendo todos los movimientos paginado");

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);

        try {
            Pageable pageable = PageRequest.of(
                    safePage,
                    safeSize,
                    Sort.by("movimientoId").ascending()
            );

            logger.info("Consultando movimientos paginados: page={}, size={}", safePage, safeSize);

            Page<Movimiento> movimientos = movimientoRepository.findAll(pageable);

            if (movimientos.isEmpty()) {
                logger.info("No hay movimientos para page={}, size={}", safePage, safeSize);
                return Page.empty(pageable);
            }

            return movimientos.map(MovimientoMapper::toVo);

        } catch (Exception e) {
            logger.error("Error al obtener movimientos: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public void eliminarPorId(Long movimientoId) {
        logger.info("Intentando eliminar movimiento con ID: {}", movimientoId);

        try {
            if (!movimientoRepository.existsById(movimientoId)) {
                logger.warn("Movimiento con ID {} no encontrado", movimientoId);
                throw new MovimientoNoEncontradoException("Movimiento no encontrado");
            }

            movimientoRepository.deleteById(movimientoId);
            logger.info("Movimiento eliminado correctamente");

        } catch (Exception e) {
            logger.error("Error al eliminar movimiento: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public MovimeintoResponseVo actualizarMovimiento(Long id, MovimientoRequestDTO dto) {
        logger.info("Actualizando movimiento con ID: {}", id);

        Movimiento movimiento = movimientoRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Movimiento con ID {} no encontrado para actualización", id);
                    return new MovimientoNoEncontradoException("Movimiento no encontrado");
                });

        Cuenta cuenta = cuentaRepository.findByNumeroCuenta(dto.getNumeroCuenta())
                .orElseThrow(() -> new CuentaNoEncontradaException("Cuenta no encontrada con número: " + dto.getNumeroCuenta()));

        // Validar que el tipo de movimiento coincida con el tipo de cuenta
        if (!Objects.equals(cuenta.getTipoCuenta(), dto.getTipo())) {
            logger.warn("El tipo de cuenta no coincide con el tipo de movimiento: {}", dto.getTipo());
            throw new DiferentesTiposException("Se está tratando de realizar un movimiento de tipo " +
                    dto.getTipo() + " en una cuenta de tipo " + cuenta.getTipoCuenta());
        }

        // Obtener el saldo base: último movimiento ANTERIOR a este
        Long saldoBase = movimientoRepository
                .findTopByCuentaIdAndFechaBeforeOrderByFechaDesc(cuenta.getCuentaId(), movimiento.getFecha())
                .map(Movimiento::getSaldo)
                .orElse(cuenta.getSaldoInicial());

        // Calcular nuevo saldo con el valor actualizado
        Long nuevoSaldo = saldoBase + dto.getValor();

        if (nuevoSaldo < 0) {
            logger.warn("Saldo insuficiente para actualizar movimiento. Nuevo saldo sería: {}", nuevoSaldo);
            throw new SaldoInsuficiente("Saldo insuficiente para realizar el movimiento actualizado");
        }

        movimiento.setValor(dto.getValor());
        movimiento.setTipoMovimiento(dto.getTipo());
        movimiento.setFecha(dto.getFecha() != null ? dto.getFecha() : movimiento.getFecha());
        movimiento.setSaldo(nuevoSaldo);

        Movimiento actualizado = movimientoRepository.save(movimiento);

        logger.info("Movimiento actualizado correctamente con ID: {}", actualizado.getMovimientoId());
        logger.info("Nuevo saldo del movimiento: {}", nuevoSaldo);

        return MovimientoMapper.toVo(actualizado);
    }
}