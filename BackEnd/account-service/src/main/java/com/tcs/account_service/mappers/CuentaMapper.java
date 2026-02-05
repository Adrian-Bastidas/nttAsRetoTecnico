package com.tcs.account_service.mappers;

import com.tcs.account_service.dtos.cuenta.CuentaRequestDTO;
import com.tcs.account_service.dtos.cuenta.CuentaResponseVo;
import com.tcs.account_service.model.Cuenta;
import org.springframework.stereotype.Component;

@Component
public class CuentaMapper {
    public Cuenta dtoToEntity(CuentaRequestDTO dto) {
        if (dto == null) return null;

        Cuenta cuenta = new Cuenta();
        cuenta.setClienteId(dto.getClienteId());
        cuenta.setTipoCuenta(dto.getTipoCuenta());
        cuenta.setSaldoInicial(dto.getSaldoInicial());
        cuenta.setEstado(true);

        return cuenta;
    }

    public CuentaResponseVo entityToVO(Cuenta entity) {
        if (entity == null) return null;

        CuentaResponseVo vo = new CuentaResponseVo();
        vo.setCuentaId(entity.getCuentaId());
        vo.setNumeroCuenta(entity.getNumeroCuenta());
        vo.setTipoCuenta(entity.getTipoCuenta());
        vo.setSaldoInicial(entity.getSaldoInicial());
        vo.setEstado(entity.getEstado());

        return vo;
    }

    public CuentaRequestDTO entityToDTO(Cuenta entity) {
        if (entity == null) return null;

        CuentaRequestDTO dto = new CuentaRequestDTO();
        dto.setClienteId(entity.getClienteId());
        dto.setTipoCuenta(entity.getTipoCuenta());
        dto.setSaldoInicial(entity.getSaldoInicial());

        return dto;
    }
}
