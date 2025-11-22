package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PaysTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Pays getPaysSample1() {
        return new Pays().id(1L).code("code1").nom("nom1").indicatif("indicatif1");
    }

    public static Pays getPaysSample2() {
        return new Pays().id(2L).code("code2").nom("nom2").indicatif("indicatif2");
    }

    public static Pays getPaysRandomSampleGenerator() {
        return new Pays()
            .id(longCount.incrementAndGet())
            .code(UUID.randomUUID().toString())
            .nom(UUID.randomUUID().toString())
            .indicatif(UUID.randomUUID().toString());
    }
}
