package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DeviseTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Devise getDeviseSample1() {
        return new Devise().id(1L).code("code1").nomComplet("nomComplet1").symbole("symbole1").pays("pays1");
    }

    public static Devise getDeviseSample2() {
        return new Devise().id(2L).code("code2").nomComplet("nomComplet2").symbole("symbole2").pays("pays2");
    }

    public static Devise getDeviseRandomSampleGenerator() {
        return new Devise()
            .id(longCount.incrementAndGet())
            .code(UUID.randomUUID().toString())
            .nomComplet(UUID.randomUUID().toString())
            .symbole(UUID.randomUUID().toString())
            .pays(UUID.randomUUID().toString());
    }
}
