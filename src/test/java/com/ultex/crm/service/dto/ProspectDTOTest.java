package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProspectDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProspectDTO.class);
        ProspectDTO prospectDTO1 = new ProspectDTO();
        prospectDTO1.setId(1L);
        ProspectDTO prospectDTO2 = new ProspectDTO();
        assertThat(prospectDTO1).isNotEqualTo(prospectDTO2);
        prospectDTO2.setId(prospectDTO1.getId());
        assertThat(prospectDTO1).isEqualTo(prospectDTO2);
        prospectDTO2.setId(2L);
        assertThat(prospectDTO1).isNotEqualTo(prospectDTO2);
        prospectDTO1.setId(null);
        assertThat(prospectDTO1).isNotEqualTo(prospectDTO2);
    }
}
