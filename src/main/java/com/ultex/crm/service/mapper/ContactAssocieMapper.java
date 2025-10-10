package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.ContactAssocie;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.ContactAssocieDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ContactAssocie} and its DTO {@link ContactAssocieDTO}.
 */
@Mapper(componentModel = "spring")
public interface ContactAssocieMapper extends EntityMapper<ContactAssocieDTO, ContactAssocie> {
    @Mapping(target = "client", source = "client", qualifiedByName = "clientId")
    ContactAssocieDTO toDto(ContactAssocie s);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);
}
