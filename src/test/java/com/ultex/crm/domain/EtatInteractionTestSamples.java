package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EtatInteractionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static EtatInteraction getEtatInteractionSample1() {
        return new EtatInteraction().id(1L).agent("agent1");
    }

    public static EtatInteraction getEtatInteractionSample2() {
        return new EtatInteraction().id(2L).agent("agent2");
    }

    public static EtatInteraction getEtatInteractionRandomSampleGenerator() {
        return new EtatInteraction().id(longCount.incrementAndGet()).agent(UUID.randomUUID().toString());
    }
}
