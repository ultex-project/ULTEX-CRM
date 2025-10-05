package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CompanyTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Company getCompanySample1() {
        return new Company()
            .id(1L)
            .name("name1")
            .address("address1")
            .city("city1")
            .country("country1")
            .phone("phone1")
            .email("email1")
            .website("website1")
            .industry("industry1");
    }

    public static Company getCompanySample2() {
        return new Company()
            .id(2L)
            .name("name2")
            .address("address2")
            .city("city2")
            .country("country2")
            .phone("phone2")
            .email("email2")
            .website("website2")
            .industry("industry2");
    }

    public static Company getCompanyRandomSampleGenerator() {
        return new Company()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .address(UUID.randomUUID().toString())
            .city(UUID.randomUUID().toString())
            .country(UUID.randomUUID().toString())
            .phone(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .website(UUID.randomUUID().toString())
            .industry(UUID.randomUUID().toString());
    }
}
