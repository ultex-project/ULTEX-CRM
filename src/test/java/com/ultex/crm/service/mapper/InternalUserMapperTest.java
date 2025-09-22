package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.InternalUserAsserts.*;
import static com.ultex.crm.domain.InternalUserTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class InternalUserMapperTest {

    private InternalUserMapper internalUserMapper;

    @BeforeEach
    void setUp() {
        internalUserMapper = new InternalUserMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getInternalUserSample1();
        var actual = internalUserMapper.toEntity(internalUserMapper.toDto(expected));
        assertInternalUserAllPropertiesEquals(expected, actual);
    }
}
