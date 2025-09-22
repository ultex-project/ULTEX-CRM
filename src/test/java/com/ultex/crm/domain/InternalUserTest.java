package com.ultex.crm.domain;

import static com.ultex.crm.domain.InternalUserTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InternalUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(InternalUser.class);
        InternalUser internalUser1 = getInternalUserSample1();
        InternalUser internalUser2 = new InternalUser();
        assertThat(internalUser1).isNotEqualTo(internalUser2);

        internalUser2.setId(internalUser1.getId());
        assertThat(internalUser1).isEqualTo(internalUser2);

        internalUser2 = getInternalUserSample2();
        assertThat(internalUser1).isNotEqualTo(internalUser2);
    }
}
