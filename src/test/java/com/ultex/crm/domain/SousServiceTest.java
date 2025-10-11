package com.ultex.crm.domain;

import static com.ultex.crm.domain.DemandeClientTestSamples.*;
import static com.ultex.crm.domain.SousServiceTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ultex.crm.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SousServiceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SousService.class);
        SousService sousService1 = getSousServiceSample1();
        SousService sousService2 = new SousService();
        assertThat(sousService1).isNotEqualTo(sousService2);

        sousService2.setId(sousService1.getId());
        assertThat(sousService1).isEqualTo(sousService2);

        sousService2 = getSousServiceSample2();
        assertThat(sousService1).isNotEqualTo(sousService2);
    }

    @Test
    void demandesTest() {
        SousService sousService = getSousServiceRandomSampleGenerator();
        DemandeClient demandeClientBack = getDemandeClientRandomSampleGenerator();

        sousService.addDemandes(demandeClientBack);
        assertThat(sousService.getDemandes()).containsOnly(demandeClientBack);
        assertThat(demandeClientBack.getSousServices()).containsOnly(sousService);

        sousService.removeDemandes(demandeClientBack);
        assertThat(sousService.getDemandes()).doesNotContain(demandeClientBack);
        assertThat(demandeClientBack.getSousServices()).doesNotContain(sousService);

        sousService.demandes(new HashSet<>(Set.of(demandeClientBack)));
        assertThat(sousService.getDemandes()).containsOnly(demandeClientBack);
        assertThat(demandeClientBack.getSousServices()).containsOnly(sousService);

        sousService.setDemandes(new HashSet<>());
        assertThat(sousService.getDemandes()).doesNotContain(demandeClientBack);
        assertThat(demandeClientBack.getSousServices()).doesNotContain(sousService);
    }
}
