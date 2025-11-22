package com.ultex.crm.domain;

import static com.ultex.crm.domain.IncotermTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class IncotermTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Incoterm.class);
        Incoterm incoterm1 = getIncotermSample1();
        Incoterm incoterm2 = new Incoterm();
        assertThat(incoterm1).isNotEqualTo(incoterm2);

        incoterm2.setId(incoterm1.getId());
        assertThat(incoterm1).isEqualTo(incoterm2);

        incoterm2 = getIncotermSample2();
        assertThat(incoterm1).isNotEqualTo(incoterm2);
    }
}
