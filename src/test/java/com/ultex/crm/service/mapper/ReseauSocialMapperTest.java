package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.ReseauSocialAsserts.*;
import static com.ultex.crm.domain.ReseauSocialTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ReseauSocialMapperTest {

    private ReseauSocialMapper reseauSocialMapper;

    @BeforeEach
    void setUp() {
        reseauSocialMapper = new ReseauSocialMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getReseauSocialSample1();
        var actual = reseauSocialMapper.toEntity(reseauSocialMapper.toDto(expected));
        assertReseauSocialAllPropertiesEquals(expected, actual);
    }
}
