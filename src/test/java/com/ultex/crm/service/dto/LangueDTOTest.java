package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LangueDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(LangueDTO.class);
        LangueDTO langueDTO1 = new LangueDTO();
        langueDTO1.setId(1L);
        LangueDTO langueDTO2 = new LangueDTO();
        assertThat(langueDTO1).isNotEqualTo(langueDTO2);
        langueDTO2.setId(langueDTO1.getId());
        assertThat(langueDTO1).isEqualTo(langueDTO2);
        langueDTO2.setId(2L);
        assertThat(langueDTO1).isNotEqualTo(langueDTO2);
        langueDTO1.setId(null);
        assertThat(langueDTO1).isNotEqualTo(langueDTO2);
    }
}
