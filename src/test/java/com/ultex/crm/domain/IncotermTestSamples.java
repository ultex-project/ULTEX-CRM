package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class IncotermTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Incoterm getIncotermSample1() {
        return new Incoterm().id(1L).code("code1").description("description1");
    }

    public static Incoterm getIncotermSample2() {
        return new Incoterm().id(2L).code("code2").description("description2");
    }

    public static Incoterm getIncotermRandomSampleGenerator() {
        return new Incoterm().id(longCount.incrementAndGet()).code(UUID.randomUUID().toString()).description(UUID.randomUUID().toString());
    }
}
