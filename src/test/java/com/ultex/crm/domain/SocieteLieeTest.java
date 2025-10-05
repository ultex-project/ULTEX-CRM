package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.SocieteLieeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SocieteLieeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SocieteLiee.class);
        SocieteLiee societeLiee1 = getSocieteLieeSample1();
        SocieteLiee societeLiee2 = new SocieteLiee();
        assertThat(societeLiee1).isNotEqualTo(societeLiee2);

        societeLiee2.setId(societeLiee1.getId());
        assertThat(societeLiee1).isEqualTo(societeLiee2);

        societeLiee2 = getSocieteLieeSample2();
        assertThat(societeLiee1).isNotEqualTo(societeLiee2);
    }

    @Test
    void clientTest() {
        SocieteLiee societeLiee = getSocieteLieeRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        societeLiee.setClient(clientBack);
        assertThat(societeLiee.getClient()).isEqualTo(clientBack);

        societeLiee.client(null);
        assertThat(societeLiee.getClient()).isNull();
    }
}
