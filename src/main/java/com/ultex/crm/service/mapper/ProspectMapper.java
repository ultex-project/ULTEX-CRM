package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.InternalUser;
import com.ultex.crm.domain.Prospect;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.InternalUserDTO;
import com.ultex.crm.service.dto.ProspectDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Prospect} and its DTO {@link ProspectDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProspectMapper extends EntityMapper<ProspectDTO, Prospect> {
    @Mapping(target = "convertedTo", source = "convertedTo", qualifiedByName = "clientId")
    @Mapping(target = "convertedBy", source = "convertedBy", qualifiedByName = "internalUserId")
    ProspectDTO toDto(Prospect s);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);

    @Named("internalUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    InternalUserDTO toDtoInternalUserId(InternalUser internalUser);
}
