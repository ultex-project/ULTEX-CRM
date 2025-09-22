package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.InternalUser;
import com.ultex.crm.domain.Opportunity;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.InternalUserDTO;
import com.ultex.crm.service.dto.OpportunityDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Opportunity} and its DTO {@link OpportunityDTO}.
 */
@Mapper(componentModel = "spring")
public interface OpportunityMapper extends EntityMapper<OpportunityDTO, Opportunity> {
    @Mapping(target = "assignedTo", source = "assignedTo", qualifiedByName = "internalUserId")
    @Mapping(target = "client", source = "client", qualifiedByName = "clientId")
    OpportunityDTO toDto(Opportunity s);

    @Named("internalUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    InternalUserDTO toDtoInternalUserId(InternalUser internalUser);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);
}
