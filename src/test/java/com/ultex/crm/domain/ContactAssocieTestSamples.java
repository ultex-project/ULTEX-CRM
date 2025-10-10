package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ContactAssocieTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ContactAssocie getContactAssocieSample1() {
        return new ContactAssocie()
            .id(1L)
            .nom("nom1")
            .prenom("prenom1")
            .relation("relation1")
            .telephone("telephone1")
            .whatsapp("whatsapp1")
            .email("email1")
            .autorisation("autorisation1")
            .remarques("remarques1");
    }

    public static ContactAssocie getContactAssocieSample2() {
        return new ContactAssocie()
            .id(2L)
            .nom("nom2")
            .prenom("prenom2")
            .relation("relation2")
            .telephone("telephone2")
            .whatsapp("whatsapp2")
            .email("email2")
            .autorisation("autorisation2")
            .remarques("remarques2");
    }

    public static ContactAssocie getContactAssocieRandomSampleGenerator() {
        return new ContactAssocie()
            .id(longCount.incrementAndGet())
            .nom(UUID.randomUUID().toString())
            .prenom(UUID.randomUUID().toString())
            .relation(UUID.randomUUID().toString())
            .telephone(UUID.randomUUID().toString())
            .whatsapp(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .autorisation(UUID.randomUUID().toString())
            .remarques(UUID.randomUUID().toString());
    }
}
