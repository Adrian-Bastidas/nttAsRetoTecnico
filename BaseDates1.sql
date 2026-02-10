-- ============================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS NTT
-- ============================================================
-- Creación de usuario, BD y tablas con correcciones mínimas
-- Solo cambios en tabla movimiento (FK nombrada + índices)
-- ============================================================

-- Crear usuario
CREATE USER abastidas WITH PASSWORD 'nttRodio';

-- Crear base de datos
CREATE DATABASE nttdb
  WITH OWNER = abastidas
       ENCODING = 'UTF8'
       LC_COLLATE = 'en_US.utf8'
       LC_CTYPE = 'en_US.utf8'
       TEMPLATE = template0;

-- Conectar a la BD nueva
\c nttdb

-- Revocar permisos por defecto y otorgar solo al usuario
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO abastidas;

-- ============================================================
-- TABLA: persona (sin cambios)
-- ============================================================
CREATE TABLE persona (
    persona_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    genero VARCHAR(10) NOT NULL,
    edad INT NOT NULL,
    identificacion VARCHAR(20) UNIQUE NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_persona_identificacion ON persona(identificacion);

-- ============================================================
-- TABLA: cliente (sin cambios)
-- ============================================================
CREATE TABLE cliente (
    cliente_id SERIAL PRIMARY KEY,
    persona_id INT UNIQUE NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cliente_persona FOREIGN KEY (persona_id)
        REFERENCES persona(persona_id) ON DELETE CASCADE
);

CREATE INDEX idx_cliente_persona_id ON cliente(persona_id);
CREATE INDEX idx_cliente_estado ON cliente(estado);

-- ============================================================
-- TABLA: cuenta (sin cambios)
-- ============================================================
CREATE TABLE cuenta (
    cuenta_id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    numero_cuenta VARCHAR(20) UNIQUE NOT NULL,
    tipo_cuenta VARCHAR(20) NOT NULL,
    saldo_inicial NUMERIC(12, 2) NOT NULL CHECK (saldo_inicial >= 0),
    estado BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cuenta_cliente FOREIGN KEY (cliente_id)
        REFERENCES cliente(cliente_id) ON DELETE CASCADE
);

CREATE INDEX idx_cuenta_cliente_id ON cuenta(cliente_id);
CREATE INDEX idx_cuenta_numero ON cuenta(numero_cuenta);
CREATE INDEX idx_cuenta_tipo ON cuenta(tipo_cuenta);
CREATE INDEX idx_cuenta_estado ON cuenta(estado);

-- ============================================================
-- TABLA: movimiento (CON CAMBIOS)
-- ============================================================
-- Cambios:
-- 1. FK con nombre explícito: fk_movimiento_cuenta
-- 2. Índices para mejor rendimiento
-- 3. Columna created_at para auditoría (opcional)
-- ============================================================
CREATE TABLE movimiento (
    movimiento_id SERIAL PRIMARY KEY,
    cuenta_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_movimiento VARCHAR(20) NOT NULL,
    valor NUMERIC(12, 2) NOT NULL,
    saldo NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movimiento_cuenta FOREIGN KEY (cuenta_id)
        REFERENCES cuenta(cuenta_id) ON DELETE CASCADE
);

-- Índices para mejorar rendimiento de búsquedas
CREATE INDEX idx_movimiento_cuenta_id ON movimiento(cuenta_id);
CREATE INDEX idx_movimiento_fecha ON movimiento(fecha);
CREATE INDEX idx_movimiento_tipo ON movimiento(tipo_movimiento);
-- Índice compuesto para búsquedas frecuentes (cuenta + fecha)
CREATE INDEX idx_movimiento_cuenta_fecha ON movimiento(cuenta_id, fecha DESC);

-- ============================================================
-- CAMBIAR PROPIETARIOS DE TABLAS
-- ============================================================
ALTER TABLE persona OWNER TO abastidas;
ALTER TABLE cliente OWNER TO abastidas;
ALTER TABLE cuenta OWNER TO abastidas;
ALTER TABLE movimiento OWNER TO abastidas;

-- ============================================================
-- OTORGAR PERMISOS AL USUARIO
-- ============================================================
-- Permisos en tablas existentes
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO abastidas;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO abastidas;

-- Permisos por defecto para futuras tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO abastidas;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO abastidas;

-- ============================================================
-- VISTAS ÚTILES (Opcional pero recomendado)
-- ============================================================

-- Vista: Información detallada de movimientos con datos de cliente
CREATE VIEW v_movimientos_detallado AS
SELECT 
    m.movimiento_id,
    m.cuenta_id,
    c.numero_cuenta,
    c.tipo_cuenta,
    m.fecha,
    m.tipo_movimiento,
    m.valor,
    m.saldo,
    cl.cliente_id,
    p.nombre as cliente_nombre,
    p.identificacion
FROM movimiento m
JOIN cuenta c ON m.cuenta_id = c.cuenta_id
JOIN cliente cl ON c.cliente_id = cl.cliente_id
JOIN persona p ON cl.persona_id = p.persona_id
ORDER BY m.fecha DESC;

-- Vista: Saldos actuales de cuentas
CREATE VIEW v_saldos_cuentas AS
SELECT 
    c.cuenta_id,
    c.numero_cuenta,
    c.tipo_cuenta,
    c.saldo_inicial,
    COALESCE(MAX(m.saldo), c.saldo_inicial) as saldo_actual,
    c.estado,
    cl.cliente_id,
    p.nombre as cliente_nombre
FROM cuenta c
LEFT JOIN movimiento m ON c.cuenta_id = m.cuenta_id
JOIN cliente cl ON c.cliente_id = cl.cliente_id
JOIN persona p ON cl.persona_id = p.persona_id
GROUP BY c.cuenta_id, c.numero_cuenta, c.tipo_cuenta, c.saldo_inicial, 
         c.estado, cl.cliente_id, p.nombre;

-- Vista: Clientes activos con sus cuentas
CREATE VIEW v_clientes_cuentas AS
SELECT 
    cl.cliente_id,
    p.nombre,
    p.identificacion,
    p.telefono,
    c.cuenta_id,
    c.numero_cuenta,
    c.tipo_cuenta,
    c.estado,
    COUNT(m.movimiento_id) as total_movimientos
FROM cliente cl
JOIN persona p ON cl.persona_id = p.persona_id
LEFT JOIN cuenta c ON cl.cliente_id = c.cliente_id
LEFT JOIN movimiento m ON c.cuenta_id = m.cuenta_id
WHERE cl.estado = true
GROUP BY cl.cliente_id, p.nombre, p.identificacion, p.telefono,
         c.cuenta_id, c.numero_cuenta, c.tipo_cuenta, c.estado;

-- ============================================================
-- DATOS DE PRUEBA (Opcional - Comentar si no deseas)
-- ============================================================

-- INSERT INTO persona (nombre, genero, edad, identificacion, direccion, telefono) 
-- VALUES 
--     ('Juan Pérez', 'M', 35, '1234567890', 'Calle Principal 123', '555-0001'),
--     ('María García', 'F', 28, '0987654321', 'Avenida Central 456', '555-0002'),
--     ('Carlos López', 'M', 42, '1122334455', 'Calle Secundaria 789', '555-0003');

-- INSERT INTO cliente (persona_id, contrasena, estado)
-- VALUES 
--     (1, 'pass123', true),
--     (2, 'pass456', true),
--     (3, 'pass789', true);

-- INSERT INTO cuenta (cliente_id, numero_cuenta, tipo_cuenta, saldo_inicial, estado)
-- VALUES 
--     (1, '1000000001', 'AHORROS', 1000.00, true),
--     (1, '1000000002', 'CORRIENTE', 500.00, true),
--     (2, '1000000003', 'AHORROS', 2500.00, true),
--     (3, '1000000004', 'CORRIENTE', 750.00, true);

-- INSERT INTO movimiento (cuenta_id, tipo_movimiento, valor, saldo)
-- VALUES 
--     (1, 'DEPOSITO', 100.00, 1100.00),
--     (1, 'RETIRO', 50.00, 1050.00),
--     (2, 'DEPOSITO', 200.00, 700.00),
--     (3, 'RETIRO', 100.00, 2400.00);

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
-- Ejecuta esto para verificar que todo está bien:
-- SELECT * FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM v_movimientos_detallado;
-- SELECT * FROM v_saldos_cuentas;
-- SELECT * FROM v_clientes_cuentas;