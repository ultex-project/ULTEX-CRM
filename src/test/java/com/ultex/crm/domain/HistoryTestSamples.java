package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class HistoryTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static History getHistorySample1() {
        return new History()
            .id(1L)
            .entityName("entityName1")
            .entityId(1L)
            .action("action1")
            .fieldChanged("fieldChanged1")
            .oldValue("oldValue1")
            .newValue("newValue1")
            .performedBy("performedBy1")
            .ipAddress("ipAddress1")
            .userAgent("userAgent1");
    }

    public static History getHistorySample2() {
        return new History()
            .id(2L)
            .entityName("entityName2")
            .entityId(2L)
            .action("action2")
            .fieldChanged("fieldChanged2")
            .oldValue("oldValue2")
            .newValue("newValue2")
            .performedBy("performedBy2")
            .ipAddress("ipAddress2")
            .userAgent("userAgent2");
    }

    public static History getHistoryRandomSampleGenerator() {
        return new History()
            .id(longCount.incrementAndGet())
            .entityName(UUID.randomUUID().toString())
            .entityId(longCount.incrementAndGet())
            .action(UUID.randomUUID().toString())
            .fieldChanged(UUID.randomUUID().toString())
            .oldValue(UUID.randomUUID().toString())
            .newValue(UUID.randomUUID().toString())
            .performedBy(UUID.randomUUID().toString())
            .ipAddress(UUID.randomUUID().toString())
            .userAgent(UUID.randomUUID().toString());
    }
}
