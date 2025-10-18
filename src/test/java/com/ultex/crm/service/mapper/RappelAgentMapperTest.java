package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.RappelAgentAsserts.*;
import static com.ultex.crm.domain.RappelAgentTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class RappelAgentMapperTest {

    private RappelAgentMapper rappelAgentMapper;

    @BeforeEach
    void setUp() {
        rappelAgentMapper = new RappelAgentMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getRappelAgentSample1();
        var actual = rappelAgentMapper.toEntity(rappelAgentMapper.toDto(expected));
        assertRappelAgentAllPropertiesEquals(expected, actual);
    }
}
