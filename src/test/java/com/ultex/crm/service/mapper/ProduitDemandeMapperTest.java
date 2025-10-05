package com.ultex.crm.service.mapper;

import static com.ultex.crm.domain.ProduitDemandeAsserts.*;
import static com.ultex.crm.domain.ProduitDemandeTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProduitDemandeMapperTest {

    private ProduitDemandeMapper produitDemandeMapper;

    @BeforeEach
    void setUp() {
        produitDemandeMapper = new ProduitDemandeMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getProduitDemandeSample1();
        var actual = produitDemandeMapper.toEntity(produitDemandeMapper.toDto(expected));
        assertProduitDemandeAllPropertiesEquals(expected, actual);
    }
}
