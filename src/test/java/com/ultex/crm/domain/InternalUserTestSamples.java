package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class InternalUserTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static InternalUser getInternalUserSample1() {
        return new InternalUser().id(1L).fullName("fullName1").email("email1").phone("phone1");
    }

    public static InternalUser getInternalUserSample2() {
        return new InternalUser().id(2L).fullName("fullName2").email("email2").phone("phone2");
    }

    public static InternalUser getInternalUserRandomSampleGenerator() {
        return new InternalUser()
            .id(longCount.incrementAndGet())
            .fullName(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .phone(UUID.randomUUID().toString());
    }
}
