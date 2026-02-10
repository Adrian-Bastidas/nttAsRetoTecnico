package com.ntt.account_service.repository;

import com.ntt.account_service.model.Cuenta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface CuentaRepository extends JpaRepository<Cuenta, Long> {
    List<Cuenta> findByClienteId(Long clienteId);

    List<Cuenta> findByClienteIdAndEstado(Long clienteId, Boolean estado);
    Page<Cuenta> findByClienteIdAndEstado(Long clienteId, Boolean estado,  Pageable pageable);
    Optional<Cuenta> findByNumeroCuenta(String numeroCuenta);

    @Query("SELECT c FROM Cuenta c WHERE c.estado = true")
    List<Cuenta> findAllActive();

    boolean existsByNumeroCuenta(String numeroCuenta);
}
