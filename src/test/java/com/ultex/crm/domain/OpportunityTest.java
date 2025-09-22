package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.InternalUserTestSamples.*;
import static com.ultex.crm.domain.OpportunityTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OpportunityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Opportunity.class);
        Opportunity opportunity1 = getOpportunitySample1();
        Opportunity opportunity2 = new Opportunity();
        assertThat(opportunity1).isNotEqualTo(opportunity2);

        opportunity2.setId(opportunity1.getId());
        assertThat(opportunity1).isEqualTo(opportunity2);

        opportunity2 = getOpportunitySample2();
        assertThat(opportunity1).isNotEqualTo(opportunity2);
    }

    @Test
    void assignedToTest() {
        Opportunity opportunity = getOpportunityRandomSampleGenerator();
        InternalUser internalUserBack = getInternalUserRandomSampleGenerator();

        opportunity.setAssignedTo(internalUserBack);
        assertThat(opportunity.getAssignedTo()).isEqualTo(internalUserBack);

        opportunity.assignedTo(null);
        assertThat(opportunity.getAssignedTo()).isNull();
    }

    @Test
    void clientTest() {
        Opportunity opportunity = getOpportunityRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        opportunity.setClient(clientBack);
        assertThat(opportunity.getClient()).isEqualTo(clientBack);

        opportunity.client(null);
        assertThat(opportunity.getClient()).isNull();
    }
}
