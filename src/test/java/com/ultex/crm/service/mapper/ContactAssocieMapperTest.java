package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.ContactAssocieAsserts.*;
import static com.ultex.crm.domain.ContactAssocieTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ContactAssocieMapperTest {

    private ContactAssocieMapper contactAssocieMapper;

    @BeforeEach
    void setUp() {
        contactAssocieMapper = new ContactAssocieMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getContactAssocieSample1();
        var actual = contactAssocieMapper.toEntity(contactAssocieMapper.toDto(expected));
        assertContactAssocieAllPropertiesEquals(expected, actual);
    }
}
