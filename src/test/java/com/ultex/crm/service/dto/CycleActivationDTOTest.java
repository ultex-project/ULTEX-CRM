package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CycleActivationDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(CycleActivationDTO.class);
        CycleActivationDTO cycleActivationDTO1 = new CycleActivationDTO();
        cycleActivationDTO1.setId(1L);
        CycleActivationDTO cycleActivationDTO2 = new CycleActivationDTO();
        assertThat(cycleActivationDTO1).isNotEqualTo(cycleActivationDTO2);
        cycleActivationDTO2.setId(cycleActivationDTO1.getId());
        assertThat(cycleActivationDTO1).isEqualTo(cycleActivationDTO2);
        cycleActivationDTO2.setId(2L);
        assertThat(cycleActivationDTO1).isNotEqualTo(cycleActivationDTO2);
        cycleActivationDTO1.setId(null);
        assertThat(cycleActivationDTO1).isNotEqualTo(cycleActivationDTO2);
    }
}
