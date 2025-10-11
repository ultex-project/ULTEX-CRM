package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.IncotermAsserts.*;
import static com.ultex.crm.domain.IncotermTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class IncotermMapperTest {

    private IncotermMapper incotermMapper;

    @BeforeEach
    void setUp() {
        incotermMapper = new IncotermMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getIncotermSample1();
        var actual = incotermMapper.toEntity(incotermMapper.toDto(expected));
        assertIncotermAllPropertiesEquals(expected, actual);
    }
}
