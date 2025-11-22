package com.ultex.crm.domain;

import static com.ultex.crm.domain.DeviseTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DeviseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Devise.class);
        Devise devise1 = getDeviseSample1();
        Devise devise2 = new Devise();
        assertThat(devise1).isNotEqualTo(devise2);

        devise2.setId(devise1.getId());
        assertThat(devise1).isEqualTo(devise2);

        devise2 = getDeviseSample2();
        assertThat(devise1).isNotEqualTo(devise2);
    }
}
