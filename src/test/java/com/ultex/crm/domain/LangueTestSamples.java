package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class LangueTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Langue getLangueSample1() {
        return new Langue().id(1L).code("code1").nom("nom1");
    }

    public static Langue getLangueSample2() {
        return new Langue().id(2L).code("code2").nom("nom2");
    }

    public static Langue getLangueRandomSampleGenerator() {
        return new Langue().id(longCount.incrementAndGet()).code(UUID.randomUUID().toString()).nom(UUID.randomUUID().toString());
    }
}
