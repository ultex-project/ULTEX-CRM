package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.DeviseAsserts.*;
import static com.ultex.crm.domain.DeviseTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DeviseMapperTest {

    private DeviseMapper deviseMapper;

    @BeforeEach
    void setUp() {
        deviseMapper = new DeviseMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getDeviseSample1();
        var actual = deviseMapper.toEntity(deviseMapper.toDto(expected));
        assertDeviseAllPropertiesEquals(expected, actual);
    }
}
