package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InternalUserDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(InternalUserDTO.class);
        InternalUserDTO internalUserDTO1 = new InternalUserDTO();
        internalUserDTO1.setId(1L);
        InternalUserDTO internalUserDTO2 = new InternalUserDTO();
        assertThat(internalUserDTO1).isNotEqualTo(internalUserDTO2);
        internalUserDTO2.setId(internalUserDTO1.getId());
        assertThat(internalUserDTO1).isEqualTo(internalUserDTO2);
        internalUserDTO2.setId(2L);
        assertThat(internalUserDTO1).isNotEqualTo(internalUserDTO2);
        internalUserDTO1.setId(null);
        assertThat(internalUserDTO1).isNotEqualTo(internalUserDTO2);
    }
}
