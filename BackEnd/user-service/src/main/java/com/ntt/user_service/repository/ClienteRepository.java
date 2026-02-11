package com.ntt.user_service.repository;

import com.ntt.user_service.model.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente,Long> {

    boolean existsByIdentificacion(String identificacion);
    Optional<Cliente> findByClienteId(Long id);
    Optional<Cliente> findByIdentificacion(String identificacion);
    @Query("SELECT c FROM Cliente c WHERE c.estado = true AND c.identificacion LIKE %:identificacion% ORDER BY c.clienteId ASC")
    Page<Cliente> findByIdentificacionContaining(
            @Param("identificacion") String identificacion,
            Pageable pageable
    );
    Page<Cliente> findByEstadoTrue(Pageable pageable);
}
