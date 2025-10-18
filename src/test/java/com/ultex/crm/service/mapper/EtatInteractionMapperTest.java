package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.EtatInteractionAsserts.*;
import static com.ultex.crm.domain.EtatInteractionTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class EtatInteractionMapperTest {

    private EtatInteractionMapper etatInteractionMapper;

    @BeforeEach
    void setUp() {
        etatInteractionMapper = new EtatInteractionMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getEtatInteractionSample1();
        var actual = etatInteractionMapper.toEntity(etatInteractionMapper.toDto(expected));
        assertEtatInteractionAllPropertiesEquals(expected, actual);
    }
}
