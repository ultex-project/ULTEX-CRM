package com.ultex.crm.domain;

import static com.ultex.crm.domain.ClientTestSamples.*;
import static com.ultex.crm.domain.ContactAssocieTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ContactAssocieTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ContactAssocie.class);
        ContactAssocie contactAssocie1 = getContactAssocieSample1();
        ContactAssocie contactAssocie2 = new ContactAssocie();
        assertThat(contactAssocie1).isNotEqualTo(contactAssocie2);

        contactAssocie2.setId(contactAssocie1.getId());
        assertThat(contactAssocie1).isEqualTo(contactAssocie2);

        contactAssocie2 = getContactAssocieSample2();
        assertThat(contactAssocie1).isNotEqualTo(contactAssocie2);
    }

    @Test
    void clientTest() {
        ContactAssocie contactAssocie = getContactAssocieRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        contactAssocie.setClient(clientBack);
        assertThat(contactAssocie.getClient()).isEqualTo(clientBack);

        contactAssocie.client(null);
        assertThat(contactAssocie.getClient()).isNull();
    }
}
