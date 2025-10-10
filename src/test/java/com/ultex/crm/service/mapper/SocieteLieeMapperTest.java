package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.SocieteLieeAsserts.*;
import static com.ultex.crm.domain.SocieteLieeTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SocieteLieeMapperTest {

    private SocieteLieeMapper societeLieeMapper;

    @BeforeEach
    void setUp() {
        societeLieeMapper = new SocieteLieeMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getSocieteLieeSample1();
        var actual = societeLieeMapper.toEntity(societeLieeMapper.toDto(expected));
        assertSocieteLieeAllPropertiesEquals(expected, actual);
    }
}
