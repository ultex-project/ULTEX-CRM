package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.DemandeClient;
import com.ultex.crm.domain.ProduitDemande;
import com.ultex.crm.service.dto.DemandeClientDTO;
import com.ultex.crm.service.dto.ProduitDemandeDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ProduitDemande} and its DTO {@link ProduitDemandeDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProduitDemandeMapper extends EntityMapper<ProduitDemandeDTO, ProduitDemande> {
    @Mapping(target = "demande", source = "demande", qualifiedByName = "demandeClientId")
    ProduitDemandeDTO toDto(ProduitDemande s);

    @Mapping(target = "demande", ignore = true)
    ProduitDemande toEntity(ProduitDemandeDTO produitDemandeDTO);

    @Named("demandeClientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    DemandeClientDTO toDtoDemandeClientId(DemandeClient demandeClient);
}
