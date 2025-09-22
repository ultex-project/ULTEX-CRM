package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.ProspectAsserts.*;
import static com.ultex.crm.domain.ProspectTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProspectMapperTest {

    private ProspectMapper prospectMapper;

    @BeforeEach
    void setUp() {
        prospectMapper = new ProspectMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getProspectSample1();
        var actual = prospectMapper.toEntity(prospectMapper.toDto(expected));
        assertProspectAllPropertiesEquals(expected, actual);
    }
}
