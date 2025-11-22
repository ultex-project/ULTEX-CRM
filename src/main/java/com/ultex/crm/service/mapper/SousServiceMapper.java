package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.DemandeClient;
import com.ultex.crm.domain.SousService;
import com.ultex.crm.service.dto.DemandeClientDTO;
import com.ultex.crm.service.dto.SousServiceDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link SousService} and its DTO {@link SousServiceDTO}.
 */
@Mapper(componentModel = "spring")
public interface SousServiceMapper extends EntityMapper<SousServiceDTO, SousService> {
    @Mapping(target = "demandes", source = "demandes", qualifiedByName = "demandeClientIdSet")
    SousServiceDTO toDto(SousService s);

    @Mapping(target = "demandes", ignore = true)
    @Mapping(target = "removeDemandes", ignore = true)
    SousService toEntity(SousServiceDTO sousServiceDTO);

    @Named("demandeClientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    DemandeClientDTO toDtoDemandeClientId(DemandeClient demandeClient);

    @Named("demandeClientIdSet")
    default Set<DemandeClientDTO> toDtoDemandeClientIdSet(Set<DemandeClient> demandeClient) {
        return demandeClient.stream().map(this::toDtoDemandeClientId).collect(Collectors.toSet());
    }
}
