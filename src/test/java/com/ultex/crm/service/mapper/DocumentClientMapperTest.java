package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.DocumentClientAsserts.*;
import static com.ultex.crm.domain.DocumentClientTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DocumentClientMapperTest {

    private DocumentClientMapper documentClientMapper;

    @BeforeEach
    void setUp() {
        documentClientMapper = new DocumentClientMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getDocumentClientSample1();
        var actual = documentClientMapper.toEntity(documentClientMapper.toDto(expected));
        assertDocumentClientAllPropertiesEquals(expected, actual);
    }
}
