package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ProduitDemandeTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static ProduitDemande getProduitDemandeSample1() {
        return new ProduitDemande()
            .id(1L)
            .typeProduit("typeProduit1")
            .nomProduit("nomProduit1")
            .unite("unite1")
            .dimensions("dimensions1")
            .nombreCartons(1)
            .piecesParCarton(1)
            .hsCode("hsCode1")
            .origine("origine1")
            .contactFournisseur("contactFournisseur1")
            .adresseChargement("adresseChargement1")
            .adresseDechargement("adresseDechargement1")
            .ficheTechniqueUrl("ficheTechniqueUrl1")
            .photosUrl("photosUrl1")
            .piecesJointesUrl("piecesJointesUrl1");
    }

    public static ProduitDemande getProduitDemandeSample2() {
        return new ProduitDemande()
            .id(2L)
            .typeProduit("typeProduit2")
            .nomProduit("nomProduit2")
            .unite("unite2")
            .dimensions("dimensions2")
            .nombreCartons(2)
            .piecesParCarton(2)
            .hsCode("hsCode2")
            .origine("origine2")
            .contactFournisseur("contactFournisseur2")
            .adresseChargement("adresseChargement2")
            .adresseDechargement("adresseDechargement2")
            .ficheTechniqueUrl("ficheTechniqueUrl2")
            .photosUrl("photosUrl2")
            .piecesJointesUrl("piecesJointesUrl2");
    }

    public static ProduitDemande getProduitDemandeRandomSampleGenerator() {
        return new ProduitDemande()
            .id(longCount.incrementAndGet())
            .typeProduit(UUID.randomUUID().toString())
            .nomProduit(UUID.randomUUID().toString())
            .unite(UUID.randomUUID().toString())
            .dimensions(UUID.randomUUID().toString())
            .nombreCartons(intCount.incrementAndGet())
            .piecesParCarton(intCount.incrementAndGet())
            .hsCode(UUID.randomUUID().toString())
            .origine(UUID.randomUUID().toString())
            .contactFournisseur(UUID.randomUUID().toString())
            .adresseChargement(UUID.randomUUID().toString())
            .adresseDechargement(UUID.randomUUID().toString())
            .ficheTechniqueUrl(UUID.randomUUID().toString())
            .photosUrl(UUID.randomUUID().toString())
            .piecesJointesUrl(UUID.randomUUID().toString());
    }
}
