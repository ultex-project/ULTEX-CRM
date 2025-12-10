package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReseauSocialDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReseauSocialDTO.class);
        ReseauSocialDTO reseauSocialDTO1 = new ReseauSocialDTO();
        reseauSocialDTO1.setId(1L);
        ReseauSocialDTO reseauSocialDTO2 = new ReseauSocialDTO();
        assertThat(reseauSocialDTO1).isNotEqualTo(reseauSocialDTO2);
        reseauSocialDTO2.setId(reseauSocialDTO1.getId());
        assertThat(reseauSocialDTO1).isEqualTo(reseauSocialDTO2);
        reseauSocialDTO2.setId(2L);
        assertThat(reseauSocialDTO1).isNotEqualTo(reseauSocialDTO2);
        reseauSocialDTO1.setId(null);
        assertThat(reseauSocialDTO1).isNotEqualTo(reseauSocialDTO2);
    }
}
