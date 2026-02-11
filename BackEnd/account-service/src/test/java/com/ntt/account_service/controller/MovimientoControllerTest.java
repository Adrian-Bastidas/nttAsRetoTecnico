package com.ntt.account_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ntt.account_service.dtos.moviemiento.MovimeintoResponseVo;
import com.ntt.account_service.dtos.moviemiento.MovimientoRequestDTO;
import com.ntt.account_service.service.MovimientoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MovimientoController.class)
class MovimientoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MovimientoService movimientoService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void crearMovimiento_deberiaRetornar200() throws Exception {
        MovimientoRequestDTO request = new MovimientoRequestDTO();
        request.setNumeroCuenta("ACC001");
        request.setTipo("AHORRO");
        request.setValor(100L);
        request.setFecha(new Date()); // ✅ obligatorio

        when(movimientoService.crearMovimiento(any()))
                .thenReturn(new MovimeintoResponseVo());

        mockMvc.perform(post("/movimientos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void crearMovimiento_sinFecha_deberiaRetornar400() throws Exception {
        MovimientoRequestDTO request = new MovimientoRequestDTO();
        request.setNumeroCuenta("ACC001");
        request.setTipo("AHORRO");
        request.setValor(100L);
        request.setFecha(null); // ❌ inválido

        mockMvc.perform(post("/movimientos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void obtenerPorNumeroCuenta_deberiaRetornarLista() throws Exception {
        when(movimientoService.obtenerPorNumeroCuenta("ACC001"))
                .thenReturn(List.of(new MovimeintoResponseVo()));

        mockMvc.perform(get("/movimientos/cuenta/ACC001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void obtenerPorNumeroCuentaPaginado_deberiaRetornarPagina() throws Exception {
        Page<MovimeintoResponseVo> page =
                new PageImpl<>(List.of(new MovimeintoResponseVo()));

        when(movimientoService.obtenerPorNumeroCuentaPaginado("ACC001", 0, 5))
                .thenReturn(page);

        mockMvc.perform(get("/movimientos/cuenta/paginate/ACC001")
                        .param("page", "0")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    void obtenerTodos_deberiaRetornarLista() throws Exception {
        when(movimientoService.obtenerTodos())
                .thenReturn(List.of(new MovimeintoResponseVo()));

        mockMvc.perform(get("/movimientos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void obtenerTodosPaginado_deberiaRetornarPagina() throws Exception {
        Page<MovimeintoResponseVo> page =
                new PageImpl<>(List.of(new MovimeintoResponseVo()));

        when(movimientoService.obtenerTodosPaginado(0, 5))
                .thenReturn(page);

        mockMvc.perform(get("/movimientos/paginated")
                        .param("page", "0")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    void eliminarMovimiento_deberiaRetornar200() throws Exception {
        doNothing().when(movimientoService).eliminarPorId(1L);

        mockMvc.perform(delete("/movimientos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }


    @Test
    void actualizarMovimiento_deberiaRetornar200() throws Exception {
        MovimientoRequestDTO request = new MovimientoRequestDTO();
        request.setNumeroCuenta("ACC001");
        request.setTipo("AHORRO");
        request.setValor(200L);
        request.setFecha(new Date());

        when(movimientoService.actualizarMovimiento(eq(1L), any()))
                .thenReturn(new MovimeintoResponseVo());

        mockMvc.perform(put("/movimientos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void actualizarMovimiento_sinFecha_deberiaRetornar400() throws Exception {
        MovimientoRequestDTO request = new MovimientoRequestDTO();
        request.setNumeroCuenta("ACC001");
        request.setTipo("AHORRO");
        request.setValor(200L);
        request.setFecha(null);

        mockMvc.perform(put("/movimientos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
