package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.DemandeClientTestSamples.*;
import static com.ultex.crm.domain.DeviseTestSamples.*;
import static com.ultex.crm.domain.IncotermTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
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
}
