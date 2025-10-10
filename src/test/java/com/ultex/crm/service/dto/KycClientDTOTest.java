package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class KycClientDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(KycClientDTO.class);
        KycClientDTO kycClientDTO1 = new KycClientDTO();
        kycClientDTO1.setId(1L);
        KycClientDTO kycClientDTO2 = new KycClientDTO();
        assertThat(kycClientDTO1).isNotEqualTo(kycClientDTO2);
        kycClientDTO2.setId(kycClientDTO1.getId());
        assertThat(kycClientDTO1).isEqualTo(kycClientDTO2);
        kycClientDTO2.setId(2L);
        assertThat(kycClientDTO1).isNotEqualTo(kycClientDTO2);
        kycClientDTO1.setId(null);
        assertThat(kycClientDTO1).isNotEqualTo(kycClientDTO2);
    }
}
