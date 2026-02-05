package com.tcs.user_service.utils;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.security.SecureRandom;
@Component
public class ClienteIdGenerator implements IdentifierGenerator {

    private static final SecureRandom random = new SecureRandom();

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) {
        return 10000L + random.nextLong(90000L);
    }
    public Long generateId() {
        return 10000L + random.nextLong(90000L);
    }
}