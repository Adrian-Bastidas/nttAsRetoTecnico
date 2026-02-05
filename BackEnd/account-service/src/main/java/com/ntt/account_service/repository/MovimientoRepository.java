package com.ntt.account_service.repository;

import com.ntt.account_service.model.Movimiento;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {
    List<Movimiento> findByCuentaId(Long cuentaId);
    @Query("SELECT COALESCE(SUM(m.valor), 0) FROM Movimiento m WHERE m.cuentaId = :cuentaId AND m.fecha < :fecha")
    double obtenerSaldoAntesDeFecha(@Param("cuentaId") Long cuentaId, @Param("fecha") Date fecha);

    List<Movimiento> findByCuentaIdAndFechaBetween(Long cuentaId, Date desde, Date hasta);

    List<Movimiento> findByCuentaIdAndFechaBetweenOrderByFechaAsc(Long cuentaId, Date desde, Date hasta);
    Optional<Movimiento> findTopByCuentaIdOrderByFechaDesc(Long cuentaId);
}
