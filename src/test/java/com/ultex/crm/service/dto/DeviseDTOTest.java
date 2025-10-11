package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DeviseDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DeviseDTO.class);
        DeviseDTO deviseDTO1 = new DeviseDTO();
        deviseDTO1.setId(1L);
        DeviseDTO deviseDTO2 = new DeviseDTO();
        assertThat(deviseDTO1).isNotEqualTo(deviseDTO2);
        deviseDTO2.setId(deviseDTO1.getId());
        assertThat(deviseDTO1).isEqualTo(deviseDTO2);
        deviseDTO2.setId(2L);
        assertThat(deviseDTO1).isNotEqualTo(deviseDTO2);
        deviseDTO1.setId(null);
        assertThat(deviseDTO1).isNotEqualTo(deviseDTO2);
    }
}
