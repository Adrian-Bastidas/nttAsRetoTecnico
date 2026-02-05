package com.tcs.user_service.mappers;

import com.tcs.user_service.dtos.cliente.ClienteRequestDTO;
import com.tcs.user_service.dtos.cliente.ClienteResponseVo;
import com.tcs.user_service.model.Cliente;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ClienteMapper {
    Cliente dtoToEntity(ClienteRequestDTO dto);

    ClienteResponseVo entityToVo(Cliente cliente);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(ClienteRequestDTO dto, @MappingTarget Cliente cliente);
}
