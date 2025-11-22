package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class CycleActivationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static CycleActivation getCycleActivationSample1() {
        return new CycleActivation().id(1L).numeroCycle(1).statutCycle("statutCycle1");
    }

    public static CycleActivation getCycleActivationSample2() {
        return new CycleActivation().id(2L).numeroCycle(2).statutCycle("statutCycle2");
    }

    public static CycleActivation getCycleActivationRandomSampleGenerator() {
        return new CycleActivation()
            .id(longCount.incrementAndGet())
            .numeroCycle(intCount.incrementAndGet())
            .statutCycle(UUID.randomUUID().toString());
    }
}
