package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.CycleActivationTestSamples.*;
import static com.ultex.crm.domain.EtatInteractionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CycleActivationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CycleActivation.class);
        CycleActivation cycleActivation1 = getCycleActivationSample1();
        CycleActivation cycleActivation2 = new CycleActivation();
        assertThat(cycleActivation1).isNotEqualTo(cycleActivation2);

        cycleActivation2.setId(cycleActivation1.getId());
        assertThat(cycleActivation1).isEqualTo(cycleActivation2);

        cycleActivation2 = getCycleActivationSample2();
        assertThat(cycleActivation1).isNotEqualTo(cycleActivation2);
    }

    @Test
    void etatsTest() {
        CycleActivation cycleActivation = getCycleActivationRandomSampleGenerator();
        EtatInteraction etatInteractionBack = getEtatInteractionRandomSampleGenerator();

        cycleActivation.addEtats(etatInteractionBack);
        assertThat(cycleActivation.getEtats()).containsOnly(etatInteractionBack);
        assertThat(etatInteractionBack.getCycle()).isEqualTo(cycleActivation);

        cycleActivation.removeEtats(etatInteractionBack);
        assertThat(cycleActivation.getEtats()).doesNotContain(etatInteractionBack);
        assertThat(etatInteractionBack.getCycle()).isNull();

        cycleActivation.etats(new HashSet<>(Set.of(etatInteractionBack)));
        assertThat(cycleActivation.getEtats()).containsOnly(etatInteractionBack);
        assertThat(etatInteractionBack.getCycle()).isEqualTo(cycleActivation);

        cycleActivation.setEtats(new HashSet<>());
        assertThat(cycleActivation.getEtats()).doesNotContain(etatInteractionBack);
        assertThat(etatInteractionBack.getCycle()).isNull();
    }

    @Test
    void clientTest() {
        CycleActivation cycleActivation = getCycleActivationRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        cycleActivation.setClient(clientBack);
        assertThat(cycleActivation.getClient()).isEqualTo(clientBack);

        cycleActivation.client(null);
        assertThat(cycleActivation.getClient()).isNull();
    }
}
