package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HistoriqueCRMDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(HistoriqueCRMDTO.class);
        HistoriqueCRMDTO historiqueCRMDTO1 = new HistoriqueCRMDTO();
        historiqueCRMDTO1.setId(1L);
        HistoriqueCRMDTO historiqueCRMDTO2 = new HistoriqueCRMDTO();
        assertThat(historiqueCRMDTO1).isNotEqualTo(historiqueCRMDTO2);
        historiqueCRMDTO2.setId(historiqueCRMDTO1.getId());
        assertThat(historiqueCRMDTO1).isEqualTo(historiqueCRMDTO2);
        historiqueCRMDTO2.setId(2L);
        assertThat(historiqueCRMDTO1).isNotEqualTo(historiqueCRMDTO2);
        historiqueCRMDTO1.setId(null);
        assertThat(historiqueCRMDTO1).isNotEqualTo(historiqueCRMDTO2);
    }
}
