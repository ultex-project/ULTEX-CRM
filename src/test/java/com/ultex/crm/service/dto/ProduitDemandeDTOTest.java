package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProduitDemandeDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProduitDemandeDTO.class);
        ProduitDemandeDTO produitDemandeDTO1 = new ProduitDemandeDTO();
        produitDemandeDTO1.setId(1L);
        ProduitDemandeDTO produitDemandeDTO2 = new ProduitDemandeDTO();
        assertThat(produitDemandeDTO1).isNotEqualTo(produitDemandeDTO2);
        produitDemandeDTO2.setId(produitDemandeDTO1.getId());
        assertThat(produitDemandeDTO1).isEqualTo(produitDemandeDTO2);
        produitDemandeDTO2.setId(2L);
        assertThat(produitDemandeDTO1).isNotEqualTo(produitDemandeDTO2);
        produitDemandeDTO1.setId(null);
        assertThat(produitDemandeDTO1).isNotEqualTo(produitDemandeDTO2);
    }
}
