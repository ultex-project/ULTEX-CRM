package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.InternalUserTestSamples.*;
import static com.ultex.crm.domain.ProspectTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProspectTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Prospect.class);
        Prospect prospect1 = getProspectSample1();
        Prospect prospect2 = new Prospect();
        assertThat(prospect1).isNotEqualTo(prospect2);

        prospect2.setId(prospect1.getId());
        assertThat(prospect1).isEqualTo(prospect2);

        prospect2 = getProspectSample2();
        assertThat(prospect1).isNotEqualTo(prospect2);
    }

    @Test
    void convertedToTest() {
        Prospect prospect = getProspectRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        prospect.setConvertedTo(clientBack);
        assertThat(prospect.getConvertedTo()).isEqualTo(clientBack);

        prospect.convertedTo(null);
        assertThat(prospect.getConvertedTo()).isNull();
    }

    @Test
    void convertedByTest() {
        Prospect prospect = getProspectRandomSampleGenerator();
        InternalUser internalUserBack = getInternalUserRandomSampleGenerator();

        prospect.setConvertedBy(internalUserBack);
        assertThat(prospect.getConvertedBy()).isEqualTo(internalUserBack);

        prospect.convertedBy(null);
        assertThat(prospect.getConvertedBy()).isNull();
    }
}
