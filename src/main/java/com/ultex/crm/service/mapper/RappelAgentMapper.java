package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.EtatInteraction;
import com.ultex.crm.domain.InternalUser;
import com.ultex.crm.domain.RappelAgent;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.EtatInteractionDTO;
import com.ultex.crm.service.dto.InternalUserDTO;
import com.ultex.crm.service.dto.RappelAgentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link RappelAgent} and its DTO {@link RappelAgentDTO}.
 */
@Mapper(componentModel = "spring")
public interface RappelAgentMapper extends EntityMapper<RappelAgentDTO, RappelAgent> {
    @Mapping(target = "etat", source = "etat", qualifiedByName = "etatInteractionId")
    @Mapping(target = "client", source = "client", qualifiedByName = "clientId")
    @Mapping(target = "agent", source = "agent", qualifiedByName = "internalUserId")
    RappelAgentDTO toDto(RappelAgent s);

    @Named("etatInteractionId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    EtatInteractionDTO toDtoEtatInteractionId(EtatInteraction etatInteraction);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);

    @Named("internalUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    InternalUserDTO toDtoInternalUserId(InternalUser internalUser);
}
