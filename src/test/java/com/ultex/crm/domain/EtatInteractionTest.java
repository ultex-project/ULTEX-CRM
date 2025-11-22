package com.ultex.crm.domain;

import static com.ultex.crm.domain.CycleActivationTestSamples.*;
import static com.ultex.crm.domain.EtatInteractionTestSamples.*;
import static com.ultex.crm.domain.HistoriqueCRMTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EtatInteractionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EtatInteraction.class);
        EtatInteraction etatInteraction1 = getEtatInteractionSample1();
        EtatInteraction etatInteraction2 = new EtatInteraction();
        assertThat(etatInteraction1).isNotEqualTo(etatInteraction2);

        etatInteraction2.setId(etatInteraction1.getId());
        assertThat(etatInteraction1).isEqualTo(etatInteraction2);

        etatInteraction2 = getEtatInteractionSample2();
        assertThat(etatInteraction1).isNotEqualTo(etatInteraction2);
    }

    @Test
    void historiqueTest() {
        EtatInteraction etatInteraction = getEtatInteractionRandomSampleGenerator();
        HistoriqueCRM historiqueCRMBack = getHistoriqueCRMRandomSampleGenerator();

        etatInteraction.setHistorique(historiqueCRMBack);
        assertThat(etatInteraction.getHistorique()).isEqualTo(historiqueCRMBack);

        etatInteraction.historique(null);
        assertThat(etatInteraction.getHistorique()).isNull();
    }

    @Test
    void cycleTest() {
        EtatInteraction etatInteraction = getEtatInteractionRandomSampleGenerator();
        CycleActivation cycleActivationBack = getCycleActivationRandomSampleGenerator();

        etatInteraction.setCycle(cycleActivationBack);
        assertThat(etatInteraction.getCycle()).isEqualTo(cycleActivationBack);

        etatInteraction.cycle(null);
        assertThat(etatInteraction.getCycle()).isNull();
    }
}
