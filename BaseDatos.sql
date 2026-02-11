
CREATE USER abastidas WITH PASSWORD 'nttRodio';

CREATE DATABASE nttdb
  WITH OWNER = abastidas
       ENCODING = 'UTF8'
       LC_COLLATE = 'en_US.utf8'
       LC_CTYPE = 'en_US.utf8'
       TEMPLATE = template0;

\c nttdb

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO abastidas;

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

CREATE INDEX idx_movimiento_cuenta_id ON movimiento(cuenta_id);
CREATE INDEX idx_movimiento_fecha ON movimiento(fecha);
CREATE INDEX idx_movimiento_tipo ON movimiento(tipo_movimiento);
CREATE INDEX idx_movimiento_cuenta_fecha ON movimiento(cuenta_id, fecha DESC);

ALTER TABLE persona OWNER TO abastidas;
ALTER TABLE cliente OWNER TO abastidas;
ALTER TABLE cuenta OWNER TO abastidas;
ALTER TABLE movimiento OWNER TO abastidas;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO abastidas;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO abastidas;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO abastidas;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO abastidas;
