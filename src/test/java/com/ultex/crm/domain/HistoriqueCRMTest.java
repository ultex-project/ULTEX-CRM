package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.HistoriqueCRMTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HistoriqueCRMTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HistoriqueCRM.class);
        HistoriqueCRM historiqueCRM1 = getHistoriqueCRMSample1();
        HistoriqueCRM historiqueCRM2 = new HistoriqueCRM();
        assertThat(historiqueCRM1).isNotEqualTo(historiqueCRM2);

        historiqueCRM2.setId(historiqueCRM1.getId());
        assertThat(historiqueCRM1).isEqualTo(historiqueCRM2);

        historiqueCRM2 = getHistoriqueCRMSample2();
        assertThat(historiqueCRM1).isNotEqualTo(historiqueCRM2);
    }

    @Test
    void clientTest() {
        HistoriqueCRM historiqueCRM = getHistoriqueCRMRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        historiqueCRM.setClient(clientBack);
        assertThat(historiqueCRM.getClient()).isEqualTo(clientBack);

        historiqueCRM.client(null);
        assertThat(historiqueCRM.getClient()).isNull();
    }
}
