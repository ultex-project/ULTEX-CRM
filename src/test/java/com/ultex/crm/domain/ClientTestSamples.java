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
            .code("code1")
            .nomComplet("nomComplet1")
            .photoUrl("photoUrl1")
            .lieuNaissance("lieuNaissance1")
            .nationalite("nationalite1")
            .genre("genre1")
            .fonction("fonction1")
            .languePreferee("languePreferee1")
            .telephonePrincipal("telephonePrincipal1")
            .whatsapp("whatsapp1")
            .email("email1")
            .adressePersonnelle("adressePersonnelle1")
            .adressesLivraison("adressesLivraison1")
            .reseauxSociaux("reseauxSociaux1");
    }

    public static Client getClientSample2() {
        return new Client()
            .id(2L)
            .code("code2")
            .nomComplet("nomComplet2")
            .photoUrl("photoUrl2")
            .lieuNaissance("lieuNaissance2")
            .nationalite("nationalite2")
            .genre("genre2")
            .fonction("fonction2")
            .languePreferee("languePreferee2")
            .telephonePrincipal("telephonePrincipal2")
            .whatsapp("whatsapp2")
            .email("email2")
            .adressePersonnelle("adressePersonnelle2")
            .adressesLivraison("adressesLivraison2")
            .reseauxSociaux("reseauxSociaux2");
    }

    public static Client getClientRandomSampleGenerator() {
        return new Client()
            .id(longCount.incrementAndGet())
            .code(UUID.randomUUID().toString())
            .nomComplet(UUID.randomUUID().toString())
            .photoUrl(UUID.randomUUID().toString())
            .lieuNaissance(UUID.randomUUID().toString())
            .nationalite(UUID.randomUUID().toString())
            .genre(UUID.randomUUID().toString())
            .fonction(UUID.randomUUID().toString())
            .languePreferee(UUID.randomUUID().toString())
            .telephonePrincipal(UUID.randomUUID().toString())
            .whatsapp(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .adressePersonnelle(UUID.randomUUID().toString())
            .adressesLivraison(UUID.randomUUID().toString())
            .reseauxSociaux(UUID.randomUUID().toString());
    }
}
