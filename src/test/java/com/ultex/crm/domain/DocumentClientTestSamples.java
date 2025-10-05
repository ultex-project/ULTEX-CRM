package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DocumentClientTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static DocumentClient getDocumentClientSample1() {
        return new DocumentClient().id(1L).typeDocument("typeDocument1").numeroDocument("numeroDocument1").fichierUrl("fichierUrl1");
    }

    public static DocumentClient getDocumentClientSample2() {
        return new DocumentClient().id(2L).typeDocument("typeDocument2").numeroDocument("numeroDocument2").fichierUrl("fichierUrl2");
    }

    public static DocumentClient getDocumentClientRandomSampleGenerator() {
        return new DocumentClient()
            .id(longCount.incrementAndGet())
            .typeDocument(UUID.randomUUID().toString())
            .numeroDocument(UUID.randomUUID().toString())
            .fichierUrl(UUID.randomUUID().toString());
    }
}
