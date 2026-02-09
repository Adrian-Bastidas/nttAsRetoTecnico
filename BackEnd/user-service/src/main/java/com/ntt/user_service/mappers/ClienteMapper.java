package com.ntt.user_service.mappers;

import com.ntt.user_service.dtos.cliente.ClienteCompleteResponseVo;
import com.ntt.user_service.dtos.cliente.ClienteRequestDTO;
import com.ntt.user_service.dtos.cliente.ClienteResponseVo;
import com.ntt.user_service.model.Cliente;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ClienteMapper {
    Cliente dtoToEntity(ClienteRequestDTO dto);

    ClienteResponseVo entityToVo(Cliente cliente);
    ClienteCompleteResponseVo entityCompleteToVo(Cliente cliente);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(ClienteRequestDTO dto, @MappingTarget Cliente cliente);
}
