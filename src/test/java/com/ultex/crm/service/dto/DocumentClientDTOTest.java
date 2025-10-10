package com.ultex.crm.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DocumentClientDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DocumentClientDTO.class);
        DocumentClientDTO documentClientDTO1 = new DocumentClientDTO();
        documentClientDTO1.setId(1L);
        DocumentClientDTO documentClientDTO2 = new DocumentClientDTO();
        assertThat(documentClientDTO1).isNotEqualTo(documentClientDTO2);
        documentClientDTO2.setId(documentClientDTO1.getId());
        assertThat(documentClientDTO1).isEqualTo(documentClientDTO2);
        documentClientDTO2.setId(2L);
        assertThat(documentClientDTO1).isNotEqualTo(documentClientDTO2);
        documentClientDTO1.setId(null);
        assertThat(documentClientDTO1).isNotEqualTo(documentClientDTO2);
    }
}
