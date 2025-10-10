package com.ultex.crm.domain;

import static com.ultex.crm.domain.DemandeClientTestSamples.*;
import static com.ultex.crm.domain.ProduitDemandeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProduitDemandeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProduitDemande.class);
        ProduitDemande produitDemande1 = getProduitDemandeSample1();
        ProduitDemande produitDemande2 = new ProduitDemande();
        assertThat(produitDemande1).isNotEqualTo(produitDemande2);

        produitDemande2.setId(produitDemande1.getId());
        assertThat(produitDemande1).isEqualTo(produitDemande2);

        produitDemande2 = getProduitDemandeSample2();
        assertThat(produitDemande1).isNotEqualTo(produitDemande2);
    }

    @Test
    void demandeTest() {
        ProduitDemande produitDemande = getProduitDemandeRandomSampleGenerator();
        DemandeClient demandeClientBack = getDemandeClientRandomSampleGenerator();

        produitDemande.setDemande(demandeClientBack);
        assertThat(produitDemande.getDemande()).isEqualTo(demandeClientBack);

        produitDemande.demande(null);
        assertThat(produitDemande.getDemande()).isNull();
    }
}
