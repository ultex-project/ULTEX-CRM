package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.CycleActivationAsserts.*;
import static com.ultex.crm.domain.CycleActivationTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CycleActivationMapperTest {

    private CycleActivationMapper cycleActivationMapper;

    @BeforeEach
    void setUp() {
        cycleActivationMapper = new CycleActivationMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getCycleActivationSample1();
        var actual = cycleActivationMapper.toEntity(cycleActivationMapper.toDto(expected));
        assertCycleActivationAllPropertiesEquals(expected, actual);
    }
}
