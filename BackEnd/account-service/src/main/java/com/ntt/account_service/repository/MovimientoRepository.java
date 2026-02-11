package com.ntt.account_service.repository;

import com.ntt.account_service.model.Movimiento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {


    @Query("SELECT m FROM Movimiento m WHERE m.cuenta.numeroCuenta = :numeroCuenta")
    List<Movimiento> findByNumeroCuenta(@Param("numeroCuenta") String numeroCuenta);

    @Query("SELECT m FROM Movimiento m WHERE m.cuenta.numeroCuenta = :numeroCuenta")
    Page<Movimiento> findByNumeroCuenta(@Param("numeroCuenta") String numeroCuenta, Pageable pageable);


    @Query("SELECT m FROM Movimiento m WHERE m.cuenta.cuentaId = :cuentaId AND m.fecha BETWEEN :desde AND :hasta ORDER BY m.fecha ASC")
    List<Movimiento> findByCuentaIdAndFechaBetweenOrderByFechaAsc(
            @Param("cuentaId") Long cuentaId,
            @Param("desde") Date desde,
            @Param("hasta") Date hasta);

    @Query(value = "SELECT m FROM Movimiento m WHERE m.cuenta.cuentaId = :cuentaId ORDER BY m.fecha DESC LIMIT 1")
    Optional<Movimiento> findTopByCuentaIdOrderByFechaDesc(@Param("cuentaId") Long cuentaId);

    @Query(value = "SELECT m FROM Movimiento m WHERE m.cuenta.cuentaId = :cuentaId AND m.fecha < :fecha ORDER BY m.fecha DESC LIMIT 1")
    Optional<Movimiento> findTopByCuentaIdAndFechaBeforeOrderByFechaDesc(
            @Param("cuentaId") Long cuentaId,
            @Param("fecha") Date fecha);
    @Query("SELECT m FROM Movimiento m WHERE m.cuenta.cuentaId IN :cuentaIds AND m.fecha BETWEEN :desde AND :hasta ORDER BY m.fecha ASC")
    Page<Movimiento> findByCuentaIdInAndFechaBetween(
            @Param("cuentaIds") List<Long> cuentaIds,
            @Param("desde") Date desde,
            @Param("hasta") Date hasta,
            Pageable pageable);
}