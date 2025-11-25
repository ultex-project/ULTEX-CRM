package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.DemandeClientTestSamples.*;
import static com.ultex.crm.domain.DeviseTestSamples.*;
import static com.ultex.crm.domain.IncotermTestSamples.*;
import static com.ultex.crm.domain.ProduitDemandeTestSamples.*;
import static com.ultex.crm.domain.SousServiceTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class DemandeClientTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DemandeClient.class);
        DemandeClient demandeClient1 = getDemandeClientSample1();
        DemandeClient demandeClient2 = new DemandeClient();
        assertThat(demandeClient1).isNotEqualTo(demandeClient2);

        demandeClient2.setId(demandeClient1.getId());
        assertThat(demandeClient1).isEqualTo(demandeClient2);

        demandeClient2 = getDemandeClientSample2();
        assertThat(demandeClient1).isNotEqualTo(demandeClient2);
    }

    @Test
    void produitsTest() {
        DemandeClient demandeClient = getDemandeClientRandomSampleGenerator();
        ProduitDemande produitDemandeBack = getProduitDemandeRandomSampleGenerator();

        demandeClient.addProduits(produitDemandeBack);
        assertThat(demandeClient.getProduits()).containsOnly(produitDemandeBack);
        assertThat(produitDemandeBack.getDemande()).isEqualTo(demandeClient);

        demandeClient.removeProduits(produitDemandeBack);
        assertThat(demandeClient.getProduits()).doesNotContain(produitDemandeBack);
        assertThat(produitDemandeBack.getDemande()).isNull();

        demandeClient.produits(new HashSet<>(Set.of(produitDemandeBack)));
        assertThat(demandeClient.getProduits()).containsOnly(produitDemandeBack);
        assertThat(produitDemandeBack.getDemande()).isEqualTo(demandeClient);

        demandeClient.setProduits(new HashSet<>());
        assertThat(demandeClient.getProduits()).doesNotContain(produitDemandeBack);
        assertThat(produitDemandeBack.getDemande()).isNull();
    }

    @Test
    void clientTest() {
        DemandeClient demandeClient = getDemandeClientRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        demandeClient.setClient(clientBack);
        assertThat(demandeClient.getClient()).isEqualTo(clientBack);

        demandeClient.client(null);
        assertThat(demandeClient.getClient()).isNull();
    }

    @Test
    void deviseTest() {
        DemandeClient demandeClient = getDemandeClientRandomSampleGenerator();
        Devise deviseBack = getDeviseRandomSampleGenerator();

        demandeClient.setDevise(deviseBack);
        assertThat(demandeClient.getDevise()).isEqualTo(deviseBack);

        demandeClient.devise(null);
        assertThat(demandeClient.getDevise()).isNull();
    }

    @Test
    void incotermTest() {
        DemandeClient demandeClient = getDemandeClientRandomSampleGenerator();
        Incoterm incotermBack = getIncotermRandomSampleGenerator();

        demandeClient.setIncoterm(incotermBack);
        assertThat(demandeClient.getIncoterm()).isEqualTo(incotermBack);

        demandeClient.incoterm(null);
        assertThat(demandeClient.getIncoterm()).isNull();
    }

    @Test
    void sousServicesTest() {
        DemandeClient demandeClient = getDemandeClientRandomSampleGenerator();
        SousService sousServiceBack = getSousServiceRandomSampleGenerator();

        demandeClient.addSousServices(sousServiceBack);
        assertThat(demandeClient.getSousServices()).containsOnly(sousServiceBack);

        demandeClient.removeSousServices(sousServiceBack);
        assertThat(demandeClient.getSousServices()).doesNotContain(sousServiceBack);

        demandeClient.sousServices(new HashSet<>(Set.of(sousServiceBack)));
        assertThat(demandeClient.getSousServices()).containsOnly(sousServiceBack);

        demandeClient.setSousServices(new HashSet<>());
        assertThat(demandeClient.getSousServices()).doesNotContain(sousServiceBack);
    }
}
