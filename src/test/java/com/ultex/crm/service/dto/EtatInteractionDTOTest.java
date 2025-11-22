package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EtatInteractionDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(EtatInteractionDTO.class);
        EtatInteractionDTO etatInteractionDTO1 = new EtatInteractionDTO();
        etatInteractionDTO1.setId(1L);
        EtatInteractionDTO etatInteractionDTO2 = new EtatInteractionDTO();
        assertThat(etatInteractionDTO1).isNotEqualTo(etatInteractionDTO2);
        etatInteractionDTO2.setId(etatInteractionDTO1.getId());
        assertThat(etatInteractionDTO1).isEqualTo(etatInteractionDTO2);
        etatInteractionDTO2.setId(2L);
        assertThat(etatInteractionDTO1).isNotEqualTo(etatInteractionDTO2);
        etatInteractionDTO1.setId(null);
        assertThat(etatInteractionDTO1).isNotEqualTo(etatInteractionDTO2);
    }
}
