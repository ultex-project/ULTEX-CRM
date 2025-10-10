package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.DemandeClientAsserts.*;
import static com.ultex.crm.domain.DemandeClientTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DemandeClientMapperTest {

    private DemandeClientMapper demandeClientMapper;

    @BeforeEach
    void setUp() {
        demandeClientMapper = new DemandeClientMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getDemandeClientSample1();
        var actual = demandeClientMapper.toEntity(demandeClientMapper.toDto(expected));
        assertDemandeClientAllPropertiesEquals(expected, actual);
    }
}
