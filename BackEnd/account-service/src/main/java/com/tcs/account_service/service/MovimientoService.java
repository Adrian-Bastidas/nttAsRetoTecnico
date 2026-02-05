package com.tcs.account_service.service;

import com.tcs.account_service.dtos.moviemiento.MovimeintoResponseVo;
import com.tcs.account_service.dtos.moviemiento.MovimientoRequestDTO;
import com.tcs.account_service.exception.CuentaNoEncontradaException;
import com.tcs.account_service.exception.MovimientoNoEncontradoException;
import com.tcs.account_service.exception.SaldoInsuficiente;
import com.tcs.account_service.mappers.MovimientoMapper;
import com.tcs.account_service.model.Cuenta;
import com.tcs.account_service.model.Movimiento;
import com.tcs.account_service.repository.CuentaRepository;
import com.tcs.account_service.repository.MovimientoRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
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

        try {
            // Buscar la cuenta por numeroCuenta
            Cuenta cuenta = cuentaRepository.findByNumeroCuenta(dto.getNumeroCuenta())
                    .orElseThrow(() -> new CuentaNoEncontradaException("Cuenta no encontrada con número: " + dto.getNumeroCuenta()));

            // Calcular nuevo saldo sumando el valor (positivo o negativo)
            Long saldoActual = cuenta.getSaldoInicial() != null ? cuenta.getSaldoInicial() : 0L;
            Long nuevoSaldo = saldoActual + dto.getValor();

            if (nuevoSaldo < 0) {
                throw new SaldoInsuficiente("Saldo insuficiente para realizar el movimiento");
            }

            // Crear el movimiento
            Movimiento movimiento = MovimientoMapper.toEntity(dto);
            movimiento.setCuentaId(cuenta.getCuentaId());
            movimiento.setSaldo(nuevoSaldo);
            movimiento.setFecha(new Date());

            // Guardar movimiento
            Movimiento guardado = movimientoRepository.save(movimiento);
            logger.info("Movimiento guardado con ID: {}", guardado.getMovimientoId());

            // Actualizar saldo de la cuenta
            cuenta.setSaldoInicial(nuevoSaldo);
            cuentaRepository.save(cuenta);
            logger.info("Saldo de cuenta actualizado a: {}", nuevoSaldo);

            return MovimientoMapper.toVo(guardado);

        } catch (Exception e) {
            logger.error("Error al crear movimiento: {}", e.getMessage(), e);
            throw e;
        }
    }


    public List<MovimeintoResponseVo> obtenerPorNumeroCuenta(Long numeroCuenta) {
        logger.info("Buscando movimientos para número de cuenta: {}", numeroCuenta);

        try {
            List<Movimiento> movimientos = movimientoRepository.findByCuentaId(numeroCuenta);

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


        Long saldoActual = cuenta.getSaldoInicial() != null ? cuenta.getSaldoInicial() : 0L;
        Long saldoSinMovimientoViejo = saldoActual - movimiento.getValor();
        Long nuevoSaldo = saldoSinMovimientoViejo + dto.getValor();

        if (nuevoSaldo < 0) {
            throw new SaldoInsuficiente("Saldo insuficiente para realizar el movimiento actualizado");
        }

        // Actualizar campos del movimiento
        movimiento.setValor(dto.getValor());
        movimiento.setTipoMovimiento(dto.getTipo());
        movimiento.setFecha(dto.getFecha() != null ? dto.getFecha() : movimiento.getFecha());
        movimiento.setSaldo(nuevoSaldo);
        movimiento.setCuentaId(cuenta.getCuentaId());

        movimiento = movimientoRepository.save(movimiento);

        cuenta.setSaldoInicial(nuevoSaldo);
        cuentaRepository.save(cuenta);

        logger.info("Movimiento actualizado correctamente con ID: {}", movimiento.getMovimientoId());

        return MovimientoMapper.toVo(movimiento);
    }
}