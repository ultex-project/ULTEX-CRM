package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SocieteLieeDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(SocieteLieeDTO.class);
        SocieteLieeDTO societeLieeDTO1 = new SocieteLieeDTO();
        societeLieeDTO1.setId(1L);
        SocieteLieeDTO societeLieeDTO2 = new SocieteLieeDTO();
        assertThat(societeLieeDTO1).isNotEqualTo(societeLieeDTO2);
        societeLieeDTO2.setId(societeLieeDTO1.getId());
        assertThat(societeLieeDTO1).isEqualTo(societeLieeDTO2);
        societeLieeDTO2.setId(2L);
        assertThat(societeLieeDTO1).isNotEqualTo(societeLieeDTO2);
        societeLieeDTO1.setId(null);
        assertThat(societeLieeDTO1).isNotEqualTo(societeLieeDTO2);
    }
}
