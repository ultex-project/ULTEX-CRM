package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.HistoriqueCRMAsserts.*;
import static com.ultex.crm.domain.HistoriqueCRMTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class HistoriqueCRMMapperTest {

    private HistoriqueCRMMapper historiqueCRMMapper;

    @BeforeEach
    void setUp() {
        historiqueCRMMapper = new HistoriqueCRMMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getHistoriqueCRMSample1();
        var actual = historiqueCRMMapper.toEntity(historiqueCRMMapper.toDto(expected));
        assertHistoriqueCRMAllPropertiesEquals(expected, actual);
    }
}
