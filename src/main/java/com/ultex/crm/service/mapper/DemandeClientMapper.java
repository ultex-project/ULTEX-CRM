package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.DemandeClient;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.DemandeClientDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link DemandeClient} and its DTO {@link DemandeClientDTO}.
 */
@Mapper(componentModel = "spring")
public interface DemandeClientMapper extends EntityMapper<DemandeClientDTO, DemandeClient> {
    @Mapping(target = "client", source = "client", qualifiedByName = "clientId")
    DemandeClientDTO toDto(DemandeClient s);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);
}
