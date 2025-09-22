package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.OpportunityTestSamples.*;
import static com.ultex.crm.domain.ProspectTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ClientTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Client.class);
        Client client1 = getClientSample1();
        Client client2 = new Client();
        assertThat(client1).isNotEqualTo(client2);

        client2.setId(client1.getId());
        assertThat(client1).isEqualTo(client2);

        client2 = getClientSample2();
        assertThat(client1).isNotEqualTo(client2);
    }

    @Test
    void opportunitiesTest() {
        Client client = getClientRandomSampleGenerator();
        Opportunity opportunityBack = getOpportunityRandomSampleGenerator();

        client.addOpportunities(opportunityBack);
        assertThat(client.getOpportunities()).containsOnly(opportunityBack);
        assertThat(opportunityBack.getClient()).isEqualTo(client);

        client.removeOpportunities(opportunityBack);
        assertThat(client.getOpportunities()).doesNotContain(opportunityBack);
        assertThat(opportunityBack.getClient()).isNull();

        client.opportunities(new HashSet<>(Set.of(opportunityBack)));
        assertThat(client.getOpportunities()).containsOnly(opportunityBack);
        assertThat(opportunityBack.getClient()).isEqualTo(client);

        client.setOpportunities(new HashSet<>());
        assertThat(client.getOpportunities()).doesNotContain(opportunityBack);
        assertThat(opportunityBack.getClient()).isNull();
    }

    @Test
    void prospectTest() {
        Client client = getClientRandomSampleGenerator();
        Prospect prospectBack = getProspectRandomSampleGenerator();

        client.setProspect(prospectBack);
        assertThat(client.getProspect()).isEqualTo(prospectBack);
        assertThat(prospectBack.getConvertedTo()).isEqualTo(client);

        client.prospect(null);
        assertThat(client.getProspect()).isNull();
        assertThat(prospectBack.getConvertedTo()).isNull();
    }
}
