package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RappelAgentDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(RappelAgentDTO.class);
        RappelAgentDTO rappelAgentDTO1 = new RappelAgentDTO();
        rappelAgentDTO1.setId(1L);
        RappelAgentDTO rappelAgentDTO2 = new RappelAgentDTO();
        assertThat(rappelAgentDTO1).isNotEqualTo(rappelAgentDTO2);
        rappelAgentDTO2.setId(rappelAgentDTO1.getId());
        assertThat(rappelAgentDTO1).isEqualTo(rappelAgentDTO2);
        rappelAgentDTO2.setId(2L);
        assertThat(rappelAgentDTO1).isNotEqualTo(rappelAgentDTO2);
        rappelAgentDTO1.setId(null);
        assertThat(rappelAgentDTO1).isNotEqualTo(rappelAgentDTO2);
    }
}
