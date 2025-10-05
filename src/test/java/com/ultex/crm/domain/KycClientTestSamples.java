package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class KycClientTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static KycClient getKycClientSample1() {
        return new KycClient()
            .id(1L)
            .scoreStaff(1)
            .comportements("comportements1")
            .remarques("remarques1")
            .completudeKyc(1)
            .responsable("responsable1");
    }

    public static KycClient getKycClientSample2() {
        return new KycClient()
            .id(2L)
            .scoreStaff(2)
            .comportements("comportements2")
            .remarques("remarques2")
            .completudeKyc(2)
            .responsable("responsable2");
    }

    public static KycClient getKycClientRandomSampleGenerator() {
        return new KycClient()
            .id(longCount.incrementAndGet())
            .scoreStaff(intCount.incrementAndGet())
            .comportements(UUID.randomUUID().toString())
            .remarques(UUID.randomUUID().toString())
            .completudeKyc(intCount.incrementAndGet())
            .responsable(UUID.randomUUID().toString());
    }
}
