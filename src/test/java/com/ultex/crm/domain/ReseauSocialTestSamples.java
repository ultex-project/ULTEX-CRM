package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ReseauSocialTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ReseauSocial getReseauSocialSample1() {
        return new ReseauSocial().id(1L).urlProfil("urlProfil1").username("username1").type("type1");
    }

    public static ReseauSocial getReseauSocialSample2() {
        return new ReseauSocial().id(2L).urlProfil("urlProfil2").username("username2").type("type2");
    }

    public static ReseauSocial getReseauSocialRandomSampleGenerator() {
        return new ReseauSocial()
            .id(longCount.incrementAndGet())
            .urlProfil(UUID.randomUUID().toString())
            .username(UUID.randomUUID().toString())
            .type(UUID.randomUUID().toString());
    }
}
