package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.CompanyTestSamples.*;
import static com.ultex.crm.domain.ContactTestSamples.*;
import static com.ultex.crm.domain.KycClientTestSamples.*;
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
    void companyTest() {
        Client client = getClientRandomSampleGenerator();
        Company companyBack = getCompanyRandomSampleGenerator();

        client.setCompany(companyBack);
        assertThat(client.getCompany()).isEqualTo(companyBack);

        client.company(null);
        assertThat(client.getCompany()).isNull();
    }

    @Test
    void convertedFromProspectTest() {
        Client client = getClientRandomSampleGenerator();
        Prospect prospectBack = getProspectRandomSampleGenerator();

        client.setConvertedFromProspect(prospectBack);
        assertThat(client.getConvertedFromProspect()).isEqualTo(prospectBack);
        assertThat(prospectBack.getConvertedTo()).isEqualTo(client);

        client.convertedFromProspect(null);
        assertThat(client.getConvertedFromProspect()).isNull();
        assertThat(prospectBack.getConvertedTo()).isNull();
    }

    @Test
    void contactsTest() {
        Client client = getClientRandomSampleGenerator();
        Contact contactBack = getContactRandomSampleGenerator();

        client.addContacts(contactBack);
        assertThat(client.getContacts()).containsOnly(contactBack);
        assertThat(contactBack.getClient()).isEqualTo(client);

        client.removeContacts(contactBack);
        assertThat(client.getContacts()).doesNotContain(contactBack);
        assertThat(contactBack.getClient()).isNull();

        client.contacts(new HashSet<>(Set.of(contactBack)));
        assertThat(client.getContacts()).containsOnly(contactBack);
        assertThat(contactBack.getClient()).isEqualTo(client);

        client.setContacts(new HashSet<>());
        assertThat(client.getContacts()).doesNotContain(contactBack);
        assertThat(contactBack.getClient()).isNull();
    }

    @Test
    void kycClientTest() {
        Client client = getClientRandomSampleGenerator();
        KycClient kycClientBack = getKycClientRandomSampleGenerator();

        client.setKycClient(kycClientBack);
        assertThat(client.getKycClient()).isEqualTo(kycClientBack);
        assertThat(kycClientBack.getClient()).isEqualTo(client);

        client.kycClient(null);
        assertThat(client.getKycClient()).isNull();
        assertThat(kycClientBack.getClient()).isNull();
    }
}
