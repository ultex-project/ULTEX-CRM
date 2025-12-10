package com.ultex.crm.domain;

import static com.ultex.crm.domain.LangueTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LangueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Langue.class);
        Langue langue1 = getLangueSample1();
        Langue langue2 = new Langue();
        assertThat(langue1).isNotEqualTo(langue2);

        langue2.setId(langue1.getId());
        assertThat(langue1).isEqualTo(langue2);

        langue2 = getLangueSample2();
        assertThat(langue1).isNotEqualTo(langue2);
    }
}
