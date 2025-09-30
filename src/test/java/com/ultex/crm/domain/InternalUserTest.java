package com.ultex.crm.domain;

import static com.ultex.crm.domain.InternalUserTestSamples.*;
import static com.ultex.crm.domain.OpportunityTestSamples.*;
import static com.ultex.crm.domain.ProspectTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class InternalUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(InternalUser.class);
        InternalUser internalUser1 = getInternalUserSample1();
        InternalUser internalUser2 = new InternalUser();
        assertThat(internalUser1).isNotEqualTo(internalUser2);

        internalUser2.setId(internalUser1.getId());
        assertThat(internalUser1).isEqualTo(internalUser2);

        internalUser2 = getInternalUserSample2();
        assertThat(internalUser1).isNotEqualTo(internalUser2);
    }

    @Test
    void opportunitiesTest() {
        InternalUser internalUser = getInternalUserRandomSampleGenerator();
        Opportunity opportunityBack = getOpportunityRandomSampleGenerator();

        internalUser.addOpportunities(opportunityBack);
        assertThat(internalUser.getOpportunities()).containsOnly(opportunityBack);
        assertThat(opportunityBack.getAssignedTo()).isEqualTo(internalUser);

        internalUser.removeOpportunities(opportunityBack);
        assertThat(internalUser.getOpportunities()).doesNotContain(opportunityBack);
        assertThat(opportunityBack.getAssignedTo()).isNull();

        internalUser.opportunities(new HashSet<>(Set.of(opportunityBack)));
        assertThat(internalUser.getOpportunities()).containsOnly(opportunityBack);
        assertThat(opportunityBack.getAssignedTo()).isEqualTo(internalUser);

        internalUser.setOpportunities(new HashSet<>());
        assertThat(internalUser.getOpportunities()).doesNotContain(opportunityBack);
        assertThat(opportunityBack.getAssignedTo()).isNull();
    }

    @Test
    void convertedProspectsTest() {
        InternalUser internalUser = getInternalUserRandomSampleGenerator();
        Prospect prospectBack = getProspectRandomSampleGenerator();

        internalUser.addConvertedProspects(prospectBack);
        assertThat(internalUser.getConvertedProspects()).containsOnly(prospectBack);
        assertThat(prospectBack.getConvertedBy()).isEqualTo(internalUser);

        internalUser.removeConvertedProspects(prospectBack);
        assertThat(internalUser.getConvertedProspects()).doesNotContain(prospectBack);
        assertThat(prospectBack.getConvertedBy()).isNull();

        internalUser.convertedProspects(new HashSet<>(Set.of(prospectBack)));
        assertThat(internalUser.getConvertedProspects()).containsOnly(prospectBack);
        assertThat(prospectBack.getConvertedBy()).isEqualTo(internalUser);

        internalUser.setConvertedProspects(new HashSet<>());
        assertThat(internalUser.getConvertedProspects()).doesNotContain(prospectBack);
        assertThat(prospectBack.getConvertedBy()).isNull();
    }
}
