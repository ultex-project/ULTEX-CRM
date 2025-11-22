package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DemandeClientTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static DemandeClient getDemandeClientSample1() {
        return new DemandeClient().id(1L).reference("reference1").provenance("provenance1").remarqueGenerale("remarqueGenerale1");
    }

    public static DemandeClient getDemandeClientSample2() {
        return new DemandeClient().id(2L).reference("reference2").provenance("provenance2").remarqueGenerale("remarqueGenerale2");
    }

    public static DemandeClient getDemandeClientRandomSampleGenerator() {
        return new DemandeClient()
            .id(longCount.incrementAndGet())
            .reference(UUID.randomUUID().toString())
            .provenance(UUID.randomUUID().toString())
            .remarqueGenerale(UUID.randomUUID().toString());
    }
}
