package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.DemandeClient;
import com.ultex.crm.domain.Devise;
import com.ultex.crm.domain.Incoterm;
import com.ultex.crm.domain.SousService;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.DemandeClientDTO;
import com.ultex.crm.service.dto.DeviseDTO;
import com.ultex.crm.service.dto.IncotermDTO;
import com.ultex.crm.service.dto.SousServiceDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link DemandeClient} and its DTO {@link DemandeClientDTO}.
 */
@Mapper(componentModel = "spring", uses = { ProduitDemandeMapper.class })
public interface DemandeClientMapper extends EntityMapper<DemandeClientDTO, DemandeClient> {
    @Mapping(target = "client", source = "client", qualifiedByName = "clientSummary")
    @Mapping(target = "devise", source = "devise", qualifiedByName = "deviseId")
    @Mapping(target = "incoterm", source = "incoterm", qualifiedByName = "incotermId")
    @Mapping(target = "sousServices", source = "sousServices", qualifiedByName = "sousServiceIdSet")
    DemandeClientDTO toDto(DemandeClient s);

    @Mapping(target = "removeSousServices", ignore = true)
    @Mapping(target = "sousServices", source = "sousServices", qualifiedByName = "sousServiceIdSetToEntity")
    DemandeClient toEntity(DemandeClientDTO demandeClientDTO);

    @Named("clientSummary")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nomComplet", source = "nomComplet")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "photoUrl", source = "photoUrl")
    ClientDTO toDtoClientSummary(Client client);

    @Named("deviseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    DeviseDTO toDtoDeviseId(Devise devise);

    @Named("incotermId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    IncotermDTO toDtoIncotermId(Incoterm incoterm);

    @Named("sousServiceId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    SousServiceDTO toDtoSousServiceId(SousService sousService);

    @Named("sousServiceIdSet")
    default Set<SousServiceDTO> toDtoSousServiceIdSet(Set<SousService> sousService) {
        return sousService.stream().map(this::toDtoSousServiceId).collect(Collectors.toSet());
    }

    @Named("sousServiceIdSetToEntity")
    default Set<SousService> toEntitySousServiceIdSet(Set<SousServiceDTO> sousServices) {
        if (sousServices == null) {
            return new java.util.HashSet<>();
        }
        return sousServices
            .stream()
            .filter(java.util.Objects::nonNull)
            .map(dto -> {
                SousService entity = new SousService();
                entity.setId(dto.getId());
                return entity;
            })
            .collect(Collectors.toSet());
    }
}
