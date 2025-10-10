package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class HistoriqueCRMTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static HistoriqueCRM getHistoriqueCRMSample1() {
        return new HistoriqueCRM().id(1L).canal("canal1").agent("agent1").etat("etat1").observation("observation1");
    }

    public static HistoriqueCRM getHistoriqueCRMSample2() {
        return new HistoriqueCRM().id(2L).canal("canal2").agent("agent2").etat("etat2").observation("observation2");
    }

    public static HistoriqueCRM getHistoriqueCRMRandomSampleGenerator() {
        return new HistoriqueCRM()
            .id(longCount.incrementAndGet())
            .canal(UUID.randomUUID().toString())
            .agent(UUID.randomUUID().toString())
            .etat(UUID.randomUUID().toString())
            .observation(UUID.randomUUID().toString());
    }
}
