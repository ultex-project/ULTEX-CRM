package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.LangueAsserts.*;
import static com.ultex.crm.domain.LangueTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LangueMapperTest {

    private LangueMapper langueMapper;

    @BeforeEach
    void setUp() {
        langueMapper = new LangueMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getLangueSample1();
        var actual = langueMapper.toEntity(langueMapper.toDto(expected));
        assertLangueAllPropertiesEquals(expected, actual);
    }
}
