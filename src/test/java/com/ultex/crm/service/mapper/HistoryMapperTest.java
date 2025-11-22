package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.HistoryAsserts.*;
import static com.ultex.crm.domain.HistoryTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class HistoryMapperTest {

    private HistoryMapper historyMapper;

    @BeforeEach
    void setUp() {
        historyMapper = new HistoryMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getHistorySample1();
        var actual = historyMapper.toEntity(historyMapper.toDto(expected));
        assertHistoryAllPropertiesEquals(expected, actual);
    }
}
