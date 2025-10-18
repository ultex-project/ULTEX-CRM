package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.EtatInteractionTestSamples.*;
import static com.ultex.crm.domain.InternalUserTestSamples.*;
import static com.ultex.crm.domain.RappelAgentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RappelAgentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RappelAgent.class);
        RappelAgent rappelAgent1 = getRappelAgentSample1();
        RappelAgent rappelAgent2 = new RappelAgent();
        assertThat(rappelAgent1).isNotEqualTo(rappelAgent2);

        rappelAgent2.setId(rappelAgent1.getId());
        assertThat(rappelAgent1).isEqualTo(rappelAgent2);

        rappelAgent2 = getRappelAgentSample2();
        assertThat(rappelAgent1).isNotEqualTo(rappelAgent2);
    }

    @Test
    void etatTest() {
        RappelAgent rappelAgent = getRappelAgentRandomSampleGenerator();
        EtatInteraction etatInteractionBack = getEtatInteractionRandomSampleGenerator();

        rappelAgent.setEtat(etatInteractionBack);
        assertThat(rappelAgent.getEtat()).isEqualTo(etatInteractionBack);

        rappelAgent.etat(null);
        assertThat(rappelAgent.getEtat()).isNull();
    }

    @Test
    void clientTest() {
        RappelAgent rappelAgent = getRappelAgentRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        rappelAgent.setClient(clientBack);
        assertThat(rappelAgent.getClient()).isEqualTo(clientBack);

        rappelAgent.client(null);
        assertThat(rappelAgent.getClient()).isNull();
    }

    @Test
    void agentTest() {
        RappelAgent rappelAgent = getRappelAgentRandomSampleGenerator();
        InternalUser internalUserBack = getInternalUserRandomSampleGenerator();

        rappelAgent.setAgent(internalUserBack);
        assertThat(rappelAgent.getAgent()).isEqualTo(internalUserBack);

        rappelAgent.agent(null);
        assertThat(rappelAgent.getAgent()).isNull();
    }
}
