package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class OpportunityTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Opportunity getOpportunitySample1() {
        return new Opportunity().id(1L).title("title1").description("description1");
    }

    public static Opportunity getOpportunitySample2() {
        return new Opportunity().id(2L).title("title2").description("description2");
    }

    public static Opportunity getOpportunityRandomSampleGenerator() {
        return new Opportunity()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString());
    }
}
