package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.ReseauSocialTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReseauSocialTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReseauSocial.class);
        ReseauSocial reseauSocial1 = getReseauSocialSample1();
        ReseauSocial reseauSocial2 = new ReseauSocial();
        assertThat(reseauSocial1).isNotEqualTo(reseauSocial2);

        reseauSocial2.setId(reseauSocial1.getId());
        assertThat(reseauSocial1).isEqualTo(reseauSocial2);

        reseauSocial2 = getReseauSocialSample2();
        assertThat(reseauSocial1).isNotEqualTo(reseauSocial2);
    }

    @Test
    void clientTest() {
        ReseauSocial reseauSocial = getReseauSocialRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        reseauSocial.setClient(clientBack);
        assertThat(reseauSocial.getClient()).isEqualTo(clientBack);

        reseauSocial.client(null);
        assertThat(reseauSocial.getClient()).isNull();
    }
}
