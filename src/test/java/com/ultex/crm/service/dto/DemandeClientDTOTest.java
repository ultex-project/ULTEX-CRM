package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DemandeClientDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DemandeClientDTO.class);
        DemandeClientDTO demandeClientDTO1 = new DemandeClientDTO();
        demandeClientDTO1.setId(1L);
        DemandeClientDTO demandeClientDTO2 = new DemandeClientDTO();
        assertThat(demandeClientDTO1).isNotEqualTo(demandeClientDTO2);
        demandeClientDTO2.setId(demandeClientDTO1.getId());
        assertThat(demandeClientDTO1).isEqualTo(demandeClientDTO2);
        demandeClientDTO2.setId(2L);
        assertThat(demandeClientDTO1).isNotEqualTo(demandeClientDTO2);
        demandeClientDTO1.setId(null);
        assertThat(demandeClientDTO1).isNotEqualTo(demandeClientDTO2);
    }
}
