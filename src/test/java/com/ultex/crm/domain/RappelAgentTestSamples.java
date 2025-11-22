package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class RappelAgentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static RappelAgent getRappelAgentSample1() {
        return new RappelAgent().id(1L).rappelMessage("rappelMessage1");
    }

    public static RappelAgent getRappelAgentSample2() {
        return new RappelAgent().id(2L).rappelMessage("rappelMessage2");
    }

    public static RappelAgent getRappelAgentRandomSampleGenerator() {
        return new RappelAgent().id(longCount.incrementAndGet()).rappelMessage(UUID.randomUUID().toString());
    }
}
