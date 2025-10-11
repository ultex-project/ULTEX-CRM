package com.ultex.crm.domain;

import static com.ultex.crm.domain.PaysTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PaysTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pays.class);
        Pays pays1 = getPaysSample1();
        Pays pays2 = new Pays();
        assertThat(pays1).isNotEqualTo(pays2);

        pays2.setId(pays1.getId());
        assertThat(pays1).isEqualTo(pays2);

        pays2 = getPaysSample2();
        assertThat(pays1).isNotEqualTo(pays2);
    }
}
