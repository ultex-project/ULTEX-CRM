package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ProspectTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Prospect getProspectSample1() {
        return new Prospect().id(1L).firstName("firstName1").lastName("lastName1").email("email1").phone("phone1").source("source1");
    }

    public static Prospect getProspectSample2() {
        return new Prospect().id(2L).firstName("firstName2").lastName("lastName2").email("email2").phone("phone2").source("source2");
    }

    public static Prospect getProspectRandomSampleGenerator() {
        return new Prospect()
            .id(longCount.incrementAndGet())
            .firstName(UUID.randomUUID().toString())
            .lastName(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .phone(UUID.randomUUID().toString())
            .source(UUID.randomUUID().toString());
    }
}
