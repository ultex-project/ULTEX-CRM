package com.ultex.crm.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ProduitDemandeTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ProduitDemande getProduitDemandeSample1() {
        return new ProduitDemande()
            .id(1L)
            .nomProduit("nomProduit1")
            .unite("unite1")
            .dimensions("dimensions1")
            .hsCode("hsCode1")
            .origine("origine1")
            .fournisseur("fournisseur1")
            .adresseChargement("adresseChargement1")
            .adresseDechargement("adresseDechargement1")
            .ficheTechniqueUrl("ficheTechniqueUrl1")
            .photosUrl("photosUrl1")
            .piecesJointesUrl("piecesJointesUrl1");
    }

    public static ProduitDemande getProduitDemandeSample2() {
        return new ProduitDemande()
            .id(2L)
            .nomProduit("nomProduit2")
            .unite("unite2")
            .dimensions("dimensions2")
            .hsCode("hsCode2")
            .origine("origine2")
            .fournisseur("fournisseur2")
            .adresseChargement("adresseChargement2")
            .adresseDechargement("adresseDechargement2")
            .ficheTechniqueUrl("ficheTechniqueUrl2")
            .photosUrl("photosUrl2")
            .piecesJointesUrl("piecesJointesUrl2");
    }

    public static ProduitDemande getProduitDemandeRandomSampleGenerator() {
        return new ProduitDemande()
            .id(longCount.incrementAndGet())
            .nomProduit(UUID.randomUUID().toString())
            .unite(UUID.randomUUID().toString())
            .dimensions(UUID.randomUUID().toString())
            .hsCode(UUID.randomUUID().toString())
            .origine(UUID.randomUUID().toString())
            .fournisseur(UUID.randomUUID().toString())
            .adresseChargement(UUID.randomUUID().toString())
            .adresseDechargement(UUID.randomUUID().toString())
            .ficheTechniqueUrl(UUID.randomUUID().toString())
            .photosUrl(UUID.randomUUID().toString())
            .piecesJointesUrl(UUID.randomUUID().toString());
    }
}
