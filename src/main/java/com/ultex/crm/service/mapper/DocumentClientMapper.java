package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.DocumentClient;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.DocumentClientDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link DocumentClient} and its DTO {@link DocumentClientDTO}.
 */
@Mapper(componentModel = "spring")
public interface DocumentClientMapper extends EntityMapper<DocumentClientDTO, DocumentClient> {
    @Mapping(target = "client", source = "client", qualifiedByName = "clientId")
    DocumentClientDTO toDto(DocumentClient s);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);
}
