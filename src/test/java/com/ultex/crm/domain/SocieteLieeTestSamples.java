package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SocieteLieeTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static SocieteLiee getSocieteLieeSample1() {
        return new SocieteLiee()
            .id(1L)
            .raisonSociale("raisonSociale1")
            .formeJuridique("formeJuridique1")
            .ice("ice1")
            .rc("rc1")
            .nif("nif1")
            .secteurActivite("secteurActivite1")
            .tailleEntreprise("tailleEntreprise1")
            .adresseSiege("adresseSiege1")
            .representantLegal("representantLegal1");
    }

    public static SocieteLiee getSocieteLieeSample2() {
        return new SocieteLiee()
            .id(2L)
            .raisonSociale("raisonSociale2")
            .formeJuridique("formeJuridique2")
            .ice("ice2")
            .rc("rc2")
            .nif("nif2")
            .secteurActivite("secteurActivite2")
            .tailleEntreprise("tailleEntreprise2")
            .adresseSiege("adresseSiege2")
            .representantLegal("representantLegal2");
    }

    public static SocieteLiee getSocieteLieeRandomSampleGenerator() {
        return new SocieteLiee()
            .id(longCount.incrementAndGet())
            .raisonSociale(UUID.randomUUID().toString())
            .formeJuridique(UUID.randomUUID().toString())
            .ice(UUID.randomUUID().toString())
            .rc(UUID.randomUUID().toString())
            .nif(UUID.randomUUID().toString())
            .secteurActivite(UUID.randomUUID().toString())
            .tailleEntreprise(UUID.randomUUID().toString())
            .adresseSiege(UUID.randomUUID().toString())
            .representantLegal(UUID.randomUUID().toString());
    }
}
