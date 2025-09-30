package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.CompanyTestSamples.*;
import static com.ultex.crm.domain.ContactTestSamples.*;
import static com.ultex.crm.domain.ProspectTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ContactTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Contact.class);
        Contact contact1 = getContactSample1();
        Contact contact2 = new Contact();
        assertThat(contact1).isNotEqualTo(contact2);

        contact2.setId(contact1.getId());
        assertThat(contact1).isEqualTo(contact2);

        contact2 = getContactSample2();
        assertThat(contact1).isNotEqualTo(contact2);
    }

    @Test
    void companyTest() {
        Contact contact = getContactRandomSampleGenerator();
        Company companyBack = getCompanyRandomSampleGenerator();

        contact.setCompany(companyBack);
        assertThat(contact.getCompany()).isEqualTo(companyBack);

        contact.company(null);
        assertThat(contact.getCompany()).isNull();
    }

    @Test
    void clientTest() {
        Contact contact = getContactRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        contact.setClient(clientBack);
        assertThat(contact.getClient()).isEqualTo(clientBack);

        contact.client(null);
        assertThat(contact.getClient()).isNull();
    }

    @Test
    void prospectTest() {
        Contact contact = getContactRandomSampleGenerator();
        Prospect prospectBack = getProspectRandomSampleGenerator();

        contact.setProspect(prospectBack);
        assertThat(contact.getProspect()).isEqualTo(prospectBack);

        contact.prospect(null);
        assertThat(contact.getProspect()).isNull();
    }
}
