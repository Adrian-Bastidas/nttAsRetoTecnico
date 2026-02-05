package com.tcs.user_service.repository;

import com.tcs.user_service.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente,Long> {

    boolean existsByIdentificacion(String identificacion);
    Optional<Cliente> findByClienteId(Long id);
}
