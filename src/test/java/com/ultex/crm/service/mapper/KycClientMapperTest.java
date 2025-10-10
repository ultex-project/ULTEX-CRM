package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.KycClientAsserts.*;
import static com.ultex.crm.domain.KycClientTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class KycClientMapperTest {

    private KycClientMapper kycClientMapper;

    @BeforeEach
    void setUp() {
        kycClientMapper = new KycClientMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getKycClientSample1();
        var actual = kycClientMapper.toEntity(kycClientMapper.toDto(expected));
        assertKycClientAllPropertiesEquals(expected, actual);
    }
}
