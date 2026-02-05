package com.tcs.account_service.utils;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import org.hibernate.query.Query;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Serializable;
import java.security.SecureRandom;

public class SafeRandomIdGenerator implements IdentifierGenerator {
    private static final Logger logger = LoggerFactory.getLogger(SafeRandomIdGenerator.class);
    private static final SecureRandom random = new SecureRandom();

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) {
        String entityName = object.getClass().getSimpleName();
        Long generatedId;
        boolean exists = true;
        int maxAttempts = 100;
        int attempts = 0;

        logger.debug("Generando ID para entidad: {}", entityName);

        do {
            switch (entityName) {
                case "Cuenta":
                    generatedId = 100000L + random.nextLong(900000L);
                    Query<Long> cuentaQuery = session.createQuery(
                            "SELECT COUNT(c.cuentaId) FROM Cuenta c WHERE c.cuentaId = :id",
                            Long.class
                    );
                    cuentaQuery.setParameter("id", generatedId);
                    exists = cuentaQuery.uniqueResult() > 0;
                    break;
                case "Movimiento":
                    generatedId = 100000L + random.nextLong(900000L);
                    Query<Long> movimientoQuery = session.createQuery(
                            "SELECT COUNT(c.cuentaId) FROM Movimiento c WHERE c.movimientoId = :id",
                            Long.class
                    );
                    movimientoQuery.setParameter("id", generatedId);
                    exists = movimientoQuery.uniqueResult() > 0;
                    break;


                default:
                    generatedId = 10000000L + random.nextLong(90000000L);
                    exists = false;
                    logger.warn("Entidad no reconocida para generación de ID: {}. Usando rango genérico.", entityName);
                    break;
            }

            attempts++;

            if (exists) {
                logger.debug("ID {} ya existe para {}. Intento {}/{}", generatedId, entityName, attempts, maxAttempts);
            }

        } while (exists && attempts < maxAttempts);

        if (attempts >= maxAttempts) {
            logger.error("No se pudo generar ID único para {} después de {} intentos", entityName, maxAttempts);
            throw new RuntimeException("No se pudo generar ID único para " + entityName + " después de " + maxAttempts + " intentos");
        }

        logger.info("ID generado exitosamente para {}: {} (intentos: {})", entityName, generatedId, attempts);
        return generatedId;
    }
}
