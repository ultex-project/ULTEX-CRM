package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ContactAssocieDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ContactAssocieDTO.class);
        ContactAssocieDTO contactAssocieDTO1 = new ContactAssocieDTO();
        contactAssocieDTO1.setId(1L);
        ContactAssocieDTO contactAssocieDTO2 = new ContactAssocieDTO();
        assertThat(contactAssocieDTO1).isNotEqualTo(contactAssocieDTO2);
        contactAssocieDTO2.setId(contactAssocieDTO1.getId());
        assertThat(contactAssocieDTO1).isEqualTo(contactAssocieDTO2);
        contactAssocieDTO2.setId(2L);
        assertThat(contactAssocieDTO1).isNotEqualTo(contactAssocieDTO2);
        contactAssocieDTO1.setId(null);
        assertThat(contactAssocieDTO1).isNotEqualTo(contactAssocieDTO2);
    }
}
