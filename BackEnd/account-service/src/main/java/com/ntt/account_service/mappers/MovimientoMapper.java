package com.ntt.account_service.mappers;

import com.ntt.account_service.dtos.moviemiento.MovimeintoResponseVo;
import com.ntt.account_service.dtos.moviemiento.MovimientoRequestDTO;
import com.ntt.account_service.model.Movimiento;
import java.text.SimpleDateFormat;
import java.util.Date;

public class MovimientoMapper {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static Movimiento toEntity(MovimientoRequestDTO dto) {
        Movimiento movimiento = new Movimiento();
        movimiento.setFecha(dto.getFecha());
        movimiento.setValor(dto.getValor());
        movimiento.setTipoMovimiento(dto.getTipo());
        return movimiento;
    }

    public static MovimeintoResponseVo toVo(Movimiento movimiento) {
        MovimeintoResponseVo vo = new MovimeintoResponseVo();

        if (movimiento.getCuenta() != null) {
            vo.setNumeroCuenta(movimiento.getCuenta().getNumeroCuenta());
        }

        vo.setMovimientoId(movimiento.getMovimientoId());
        vo.setTipo(movimiento.getTipoMovimiento());
        vo.setSaldo(String.valueOf(movimiento.getSaldo()));
        vo.setEstado(true);
        vo.setFecha(dateFormat.format(movimiento.getFecha()));

        long valor = movimiento.getValor();
        String descripcion = (valor >= 0 ? "Depósito de " : "Retiro de ") + Math.abs(valor);
        vo.setMovimiento(descripcion);

        return vo;
    }
}
