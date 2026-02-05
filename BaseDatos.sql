
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
    telefono VARCHAR(20)
);

CREATE TABLE cliente (
    cliente_id SERIAL PRIMARY KEY,
    persona_id INT UNIQUE NOT NULL
        REFERENCES persona(persona_id) ON DELETE CASCADE,
    contrasena VARCHAR(100) NOT NULL,
    estado BOOLEAN NOT NULL
);

CREATE TABLE cuenta (
    cuenta_id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL
        REFERENCES cliente(cliente_id) ON DELETE CASCADE,
    numero_cuenta VARCHAR(20) UNIQUE NOT NULL,
    tipo_cuenta VARCHAR(20) NOT NULL,
    saldo_inicial NUMERIC(12, 2) NOT NULL CHECK (saldo_inicial >= 0),
    estado BOOLEAN NOT NULL
);

CREATE TABLE movimiento (
    movimiento_id SERIAL PRIMARY KEY,
    cuenta_id INT NOT NULL
        REFERENCES cuenta(cuenta_id) ON DELETE CASCADE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_movimiento VARCHAR(20) NOT NULL,
    valor NUMERIC(12, 2) NOT NULL,
    saldo NUMERIC(12, 2) NOT NULL
);


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
