package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SousServiceTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static SousService getSousServiceSample1() {
        return new SousService().id(1L).code("code1").libelle("libelle1");
    }

    public static SousService getSousServiceSample2() {
        return new SousService().id(2L).code("code2").libelle("libelle2");
    }

    public static SousService getSousServiceRandomSampleGenerator() {
        return new SousService().id(longCount.incrementAndGet()).code(UUID.randomUUID().toString()).libelle(UUID.randomUUID().toString());
    }
}
