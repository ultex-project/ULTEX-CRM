package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class IncotermDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(IncotermDTO.class);
        IncotermDTO incotermDTO1 = new IncotermDTO();
        incotermDTO1.setId(1L);
        IncotermDTO incotermDTO2 = new IncotermDTO();
        assertThat(incotermDTO1).isNotEqualTo(incotermDTO2);
        incotermDTO2.setId(incotermDTO1.getId());
        assertThat(incotermDTO1).isEqualTo(incotermDTO2);
        incotermDTO2.setId(2L);
        assertThat(incotermDTO1).isNotEqualTo(incotermDTO2);
        incotermDTO1.setId(null);
        assertThat(incotermDTO1).isNotEqualTo(incotermDTO2);
    }
}
