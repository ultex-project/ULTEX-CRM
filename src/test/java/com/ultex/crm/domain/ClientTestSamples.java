package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ClientTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Client getClientSample1() {
        return new Client()
            .id(1L)
            .clientId(1L)
            .firstName("firstName1")
            .lastName("lastName1")
            .email("email1")
            .phone1("phone11")
            .phone2("phone21")
            .cin("cin1")
            .address("address1")
            .city("city1")
            .country("country1")
            .deliveryAddress("deliveryAddress1")
            .referredBy("referredBy1");
    }

    public static Client getClientSample2() {
        return new Client()
            .id(2L)
            .clientId(2L)
            .firstName("firstName2")
            .lastName("lastName2")
            .email("email2")
            .phone1("phone12")
            .phone2("phone22")
            .cin("cin2")
            .address("address2")
            .city("city2")
            .country("country2")
            .deliveryAddress("deliveryAddress2")
            .referredBy("referredBy2");
    }

    public static Client getClientRandomSampleGenerator() {
        return new Client()
            .id(longCount.incrementAndGet())
            .clientId(longCount.incrementAndGet())
            .firstName(UUID.randomUUID().toString())
            .lastName(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .phone1(UUID.randomUUID().toString())
            .phone2(UUID.randomUUID().toString())
            .cin(UUID.randomUUID().toString())
            .address(UUID.randomUUID().toString())
            .city(UUID.randomUUID().toString())
            .country(UUID.randomUUID().toString())
            .deliveryAddress(UUID.randomUUID().toString())
            .referredBy(UUID.randomUUID().toString());
    }
}
