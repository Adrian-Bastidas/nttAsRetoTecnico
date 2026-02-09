package com.ntt.user_service.service;

import com.ntt.user_service.dtos.cliente.ClienteRequestDTO;
import com.ntt.user_service.dtos.cliente.ClienteResponseVo;
import com.ntt.user_service.exception.ResourceAlreadyExistException;
import com.ntt.user_service.exception.ResourceNotFoundException;
import com.ntt.user_service.mappers.ClienteMapper;
import com.ntt.user_service.model.Cliente;
import com.ntt.user_service.repository.ClienteRepository;
import com.ntt.user_service.utils.ClienteIdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {
    private static final Logger logger = LoggerFactory.getLogger(ClienteService.class);

    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;
    @Autowired
    private ClienteIdGenerator clienteIdGenerator;
    @Autowired
    private PasswordEncoder passwordEncoder;


    public ClienteService(ClienteRepository clienteRepository, ClienteMapper clienteMapper) {
        this.clienteRepository = clienteRepository;
        this.clienteMapper = clienteMapper;
    }

    public ClienteResponseVo createCliente(ClienteRequestDTO dto) {
        logger.info("Iniciando creación de cliente con identificación: {}", dto.getIdentificacion());

        if (clienteRepository.existsByIdentificacion(dto.getIdentificacion())) {
            logger.warn("Intento de crear cliente con identificación ya registrada: {}", dto.getIdentificacion());
            throw new ResourceAlreadyExistException("Identificación ya registrada");
        }

        Cliente cliente = clienteMapper.dtoToEntity(dto);
        Long clienteId = (Long) new ClienteIdGenerator().generate(null, null);
        String contrasenaEncriptada = passwordEncoder.encode(cliente.getContrasena());
        cliente.setClienteId(clienteId);
        cliente.setContrasena(contrasenaEncriptada);

        Cliente clienteGuardado = clienteRepository.save(cliente);
        logger.info("Cliente creado exitosamente con ID: {} e identificación: {}", clienteId, dto.getIdentificacion());

        return clienteMapper.entityToVo(clienteGuardado);
    }

    public List<ClienteResponseVo> listClientes() {
        logger.info("Consultando lista de todos los clientes");

        List<Cliente> clientes = clienteRepository.findAll();
        if (clientes.isEmpty()) {
            logger.warn("No se encontraron clientes registrados en el sistema");
            throw new ResourceNotFoundException("No hay clientes registrados");
        }

        logger.info("Se encontraron {} clientes registrados", clientes.size());
        return clientes.stream()
                .map(clienteMapper::entityToVo)
                .collect(Collectors.toList());
    }

    public Page<ClienteResponseVo> pageClientes(int page, int size) {

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);

        Pageable pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by("clienteId").ascending()
        );

        logger.info("Consultando clientes paginados: page={}, size={}", safePage, safeSize);

        Page<Cliente> clientesPage = clienteRepository.findAll(pageable);

        if (clientesPage.isEmpty()) {
            logger.info("No hay clientes para page={}, size={}", safePage, safeSize);
            return Page.empty(pageable);
        }

        logger.info(
                "Clientes obtenidos: page={}, size={}, elements={}, total={}",
                clientesPage.getNumber(),
                clientesPage.getSize(),
                clientesPage.getNumberOfElements(),
                clientesPage.getTotalElements()
        );

        return clientesPage.map(clienteMapper::entityToVo);
    }


    public ClienteResponseVo updateCliente(Long id, ClienteRequestDTO dto) {
        logger.info("Iniciando actualización del cliente con ID: {}", id);

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Intento de actualizar cliente no encontrado con ID: {}", id);
                    return new ResourceNotFoundException("Cliente no encontrado con ID: " + id);
                });

        logger.debug("Cliente encontrado para actualización: ID {} - Identificación: {}", id, cliente.getIdentificacion());

        clienteMapper.updateEntityFromDto(dto, cliente);

        if (dto.getContrasena() != null && !dto.getContrasena().isBlank()) {
            String encryptedPassword = passwordEncoder.encode(dto.getContrasena());
            cliente.setContrasena(encryptedPassword);
            logger.debug("Contraseña actualizada con BCrypt para cliente ID: {}", id);
        }

        Cliente clienteActualizado = clienteRepository.save(cliente);
        logger.info("Cliente actualizado exitosamente con ID: {}", id);

        return clienteMapper.entityToVo(clienteActualizado);
    }


    public void deleteCliente(Long id) {
        logger.info("Iniciando eliminación del cliente con ID: {}", id);

        if (!clienteRepository.existsById(id)) {
            logger.warn("Intento de eliminar cliente no encontrado con ID: {}", id);
            throw new ResourceNotFoundException("Cliente no encontrado con ID: " + id);
        }

        clienteRepository.deleteById(id);
        logger.info("Cliente eliminado exitosamente con ID: {}", id);
    }

    public ClienteResponseVo getCliente(Long id) {
        logger.info("Consultando cliente con ID: {}", id);

        Cliente cliente = clienteRepository.findByClienteId(id)
                .orElseThrow(() -> {
                    logger.warn("Cliente no encontrado con ID: {}", id);
                    return new ResourceNotFoundException("Cliente no encontrado con ID: " + id);
                });

        logger.debug("Cliente encontrado: ID {} - Identificación: {}", id, cliente.getIdentificacion());
        return clienteMapper.entityToVo(cliente);
    }

    public ClienteResponseVo getClientebycedula(String identificacion) {
        logger.info("Consultando cliente con identificacion: {}", identificacion);

        Cliente cliente = clienteRepository.findByIdentificacion(identificacion)
                .orElseThrow(() -> {
                    logger.warn("Cliente no encontrado con identificacion: {}", identificacion);
                    return new ResourceNotFoundException("Cliente no encontrado con identificacion: " + identificacion);
                });

        logger.debug("Cliente encontrado: ID {} - Identificación: {}", identificacion, cliente.getIdentificacion());
        return clienteMapper.entityToVo(cliente);
    }
    public Page<ClienteResponseVo> pageClientesByIdentificacion(
            String identificacion,
            int page,
            int size
    ) {

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);

        Pageable pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by("clienteId").ascending()
        );

        logger.info(
                "Consultando clientes paginados por identificacion: {}, page={}, size={}",
                identificacion,
                safePage,
                safeSize
        );

        Page<Cliente> clientesPage =
                clienteRepository.findByIdentificacionContaining(identificacion, pageable);

        if (clientesPage.isEmpty()) {
            logger.info(
                    "No se encontraron clientes con identificacion={} page={} size={}",
                    identificacion,
                    safePage,
                    safeSize
            );
            return Page.empty(pageable);
        }

        logger.info(
                "Clientes obtenidos: identificacion={}, page={}, size={}, elements={}, total={}",
                identificacion,
                clientesPage.getNumber(),
                clientesPage.getSize(),
                clientesPage.getNumberOfElements(),
                clientesPage.getTotalElements()
        );

        return clientesPage.map(clienteMapper::entityToVo);
    }

}
