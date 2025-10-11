package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class DemandeClientTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static DemandeClient getDemandeClientSample1() {
        return new DemandeClient()
            .id(1L)
            .reference("reference1")
            .servicePrincipal("servicePrincipal1")
            .sousServices("sousServices1")
            .provenance("provenance1")
            .nombreProduits(1)
            .remarqueGenerale("remarqueGenerale1");
    }

    public static DemandeClient getDemandeClientSample2() {
        return new DemandeClient()
            .id(2L)
            .reference("reference2")
            .servicePrincipal("servicePrincipal2")
            .sousServices("sousServices2")
            .provenance("provenance2")
            .nombreProduits(2)
            .remarqueGenerale("remarqueGenerale2");
    }

    public static DemandeClient getDemandeClientRandomSampleGenerator() {
        return new DemandeClient()
            .id(longCount.incrementAndGet())
            .reference(UUID.randomUUID().toString())
            .servicePrincipal(UUID.randomUUID().toString())
            .sousServices(UUID.randomUUID().toString())
            .provenance(UUID.randomUUID().toString())
            .nombreProduits(intCount.incrementAndGet())
            .remarqueGenerale(UUID.randomUUID().toString());
    }
}
