package com.tcs.user_service.utils;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import org.hibernate.query.Query;
import java.io.Serializable;
import java.security.SecureRandom;

public class SafeRandomIdGenerator implements IdentifierGenerator {

    private static final SecureRandom random = new SecureRandom();

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) {
        String entityName = object.getClass().getSimpleName();
        Long generatedId;
        boolean exists = true;
        int maxAttempts = 100;
        int attempts = 0;

        do {
            if ("Cliente".equals(entityName)) {
                generatedId = 10000L + random.nextLong(90000L);

                Query<Long> query = session.createQuery(
                        "SELECT COUNT(c.clienteId) FROM Cliente c WHERE c.clienteId = :id",
                        Long.class
                );
                query.setParameter("id", generatedId);
                exists = query.uniqueResult() > 0;

            } else {
                generatedId = 100000L + random.nextLong(900000L);

                Query<Long> query = session.createQuery(
                        "SELECT COUNT(p.personaId) FROM Persona p WHERE p.personaId = :id",
                        Long.class
                );
                query.setParameter("id", generatedId);
                exists = query.uniqueResult() > 0;
            }

            attempts++;
        } while (exists && attempts < maxAttempts);

        if (attempts >= maxAttempts) {
            throw new RuntimeException("No se pudo generar ID único después de " + maxAttempts + " intentos");
        }

        return generatedId;
    }
}