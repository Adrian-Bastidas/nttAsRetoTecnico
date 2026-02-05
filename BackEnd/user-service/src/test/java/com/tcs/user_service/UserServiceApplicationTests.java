package com.tcs.user_service;

import com.tcs.user_service.model.Cliente;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserServiceApplicationTests {

	@Test
	public void testCrearClienteDesdeJson() {
		Cliente cliente = new Cliente();
		cliente.setIdentificacion("1234567895");
		cliente.setNombre("Chespirito");
		cliente.setGenero("Masculino");
		cliente.setEdad(23);
		cliente.setDireccion("Av. Siempre Viva 742");
		cliente.setTelefono("0991234567");
		cliente.setContrasena("MiContrasenaSegura123");
		cliente.setEstado(true);

		assertEquals("1234567895", cliente.getIdentificacion());
		assertEquals("Chespirito", cliente.getNombre());
		assertEquals("Masculino", cliente.getGenero());
		assertEquals(23, cliente.getEdad());
		assertEquals("Av. Siempre Viva 742", cliente.getDireccion());
		assertEquals("0991234567", cliente.getTelefono());
		assertEquals("MiContrasenaSegura123", cliente.getContrasena());
		assertTrue(cliente.getEstado());
	}

}
