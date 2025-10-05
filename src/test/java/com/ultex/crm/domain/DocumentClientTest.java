package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.DocumentClientTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DocumentClientTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DocumentClient.class);
        DocumentClient documentClient1 = getDocumentClientSample1();
        DocumentClient documentClient2 = new DocumentClient();
        assertThat(documentClient1).isNotEqualTo(documentClient2);

        documentClient2.setId(documentClient1.getId());
        assertThat(documentClient1).isEqualTo(documentClient2);

        documentClient2 = getDocumentClientSample2();
        assertThat(documentClient1).isNotEqualTo(documentClient2);
    }

    @Test
    void clientTest() {
        DocumentClient documentClient = getDocumentClientRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        documentClient.setClient(clientBack);
        assertThat(documentClient.getClient()).isEqualTo(clientBack);

        documentClient.client(null);
        assertThat(documentClient.getClient()).isNull();
    }
}
