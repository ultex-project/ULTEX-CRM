package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SousServiceDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(SousServiceDTO.class);
        SousServiceDTO sousServiceDTO1 = new SousServiceDTO();
        sousServiceDTO1.setId(1L);
        SousServiceDTO sousServiceDTO2 = new SousServiceDTO();
        assertThat(sousServiceDTO1).isNotEqualTo(sousServiceDTO2);
        sousServiceDTO2.setId(sousServiceDTO1.getId());
        assertThat(sousServiceDTO1).isEqualTo(sousServiceDTO2);
        sousServiceDTO2.setId(2L);
        assertThat(sousServiceDTO1).isNotEqualTo(sousServiceDTO2);
        sousServiceDTO1.setId(null);
        assertThat(sousServiceDTO1).isNotEqualTo(sousServiceDTO2);
    }
}
