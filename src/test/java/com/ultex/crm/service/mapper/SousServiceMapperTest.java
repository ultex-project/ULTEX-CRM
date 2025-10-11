package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.SousServiceAsserts.*;
import static com.ultex.crm.domain.SousServiceTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SousServiceMapperTest {

    private SousServiceMapper sousServiceMapper;

    @BeforeEach
    void setUp() {
        sousServiceMapper = new SousServiceMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getSousServiceSample1();
        var actual = sousServiceMapper.toEntity(sousServiceMapper.toDto(expected));
        assertSousServiceAllPropertiesEquals(expected, actual);
    }
}
