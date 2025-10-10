package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.KycClientTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class KycClientTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(KycClient.class);
        KycClient kycClient1 = getKycClientSample1();
        KycClient kycClient2 = new KycClient();
        assertThat(kycClient1).isNotEqualTo(kycClient2);

        kycClient2.setId(kycClient1.getId());
        assertThat(kycClient1).isEqualTo(kycClient2);

        kycClient2 = getKycClientSample2();
        assertThat(kycClient1).isNotEqualTo(kycClient2);
    }

    @Test
    void clientTest() {
        KycClient kycClient = getKycClientRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        kycClient.setClient(clientBack);
        assertThat(kycClient.getClient()).isEqualTo(clientBack);

        kycClient.client(null);
        assertThat(kycClient.getClient()).isNull();
    }
}
