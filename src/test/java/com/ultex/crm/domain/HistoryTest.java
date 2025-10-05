package com.ultex.crm.domain;

import static com.ultex.crm.domain.HistoryTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HistoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(History.class);
        History history1 = getHistorySample1();
        History history2 = new History();
        assertThat(history1).isNotEqualTo(history2);

        history2.setId(history1.getId());
        assertThat(history1).isEqualTo(history2);

        history2 = getHistorySample2();
        assertThat(history1).isNotEqualTo(history2);
    }
}
