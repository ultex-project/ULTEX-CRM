package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.CompanyTestSamples.*;
import static com.ultex.crm.domain.ContactTestSamples.*;
import static com.ultex.crm.domain.ProspectTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CompanyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Company.class);
        Company company1 = getCompanySample1();
        Company company2 = new Company();
        assertThat(company1).isNotEqualTo(company2);

        company2.setId(company1.getId());
        assertThat(company1).isEqualTo(company2);

        company2 = getCompanySample2();
        assertThat(company1).isNotEqualTo(company2);
    }

    @Test
    void clientsTest() {
        Company company = getCompanyRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        company.addClients(clientBack);
        assertThat(company.getClients()).containsOnly(clientBack);
        assertThat(clientBack.getCompany()).isEqualTo(company);

        company.removeClients(clientBack);
        assertThat(company.getClients()).doesNotContain(clientBack);
        assertThat(clientBack.getCompany()).isNull();

        company.clients(new HashSet<>(Set.of(clientBack)));
        assertThat(company.getClients()).containsOnly(clientBack);
        assertThat(clientBack.getCompany()).isEqualTo(company);

        company.setClients(new HashSet<>());
        assertThat(company.getClients()).doesNotContain(clientBack);
        assertThat(clientBack.getCompany()).isNull();
    }

    @Test
    void prospectsTest() {
        Company company = getCompanyRandomSampleGenerator();
        Prospect prospectBack = getProspectRandomSampleGenerator();

        company.addProspects(prospectBack);
        assertThat(company.getProspects()).containsOnly(prospectBack);
        assertThat(prospectBack.getCompany()).isEqualTo(company);

        company.removeProspects(prospectBack);
        assertThat(company.getProspects()).doesNotContain(prospectBack);
        assertThat(prospectBack.getCompany()).isNull();

        company.prospects(new HashSet<>(Set.of(prospectBack)));
        assertThat(company.getProspects()).containsOnly(prospectBack);
        assertThat(prospectBack.getCompany()).isEqualTo(company);

        company.setProspects(new HashSet<>());
        assertThat(company.getProspects()).doesNotContain(prospectBack);
        assertThat(prospectBack.getCompany()).isNull();
    }

    @Test
    void contactsTest() {
        Company company = getCompanyRandomSampleGenerator();
        Contact contactBack = getContactRandomSampleGenerator();

        company.addContacts(contactBack);
        assertThat(company.getContacts()).containsOnly(contactBack);
        assertThat(contactBack.getCompany()).isEqualTo(company);

        company.removeContacts(contactBack);
        assertThat(company.getContacts()).doesNotContain(contactBack);
        assertThat(contactBack.getCompany()).isNull();

        company.contacts(new HashSet<>(Set.of(contactBack)));
        assertThat(company.getContacts()).containsOnly(contactBack);
        assertThat(contactBack.getCompany()).isEqualTo(company);

        company.setContacts(new HashSet<>());
        assertThat(company.getContacts()).doesNotContain(contactBack);
        assertThat(contactBack.getCompany()).isNull();
    }
}
