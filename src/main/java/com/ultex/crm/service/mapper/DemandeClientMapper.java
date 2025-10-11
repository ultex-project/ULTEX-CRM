package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.DemandeClient;
import com.ultex.crm.domain.Devise;
import com.ultex.crm.domain.Incoterm;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.DemandeClientDTO;
import com.ultex.crm.service.dto.DeviseDTO;
import com.ultex.crm.service.dto.IncotermDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link DemandeClient} and its DTO {@link DemandeClientDTO}.
 */
@Mapper(componentModel = "spring")
public interface DemandeClientMapper extends EntityMapper<DemandeClientDTO, DemandeClient> {
    @Mapping(target = "client", source = "client", qualifiedByName = "clientId")
    @Mapping(target = "devise", source = "devise", qualifiedByName = "deviseId")
    @Mapping(target = "incoterm", source = "incoterm", qualifiedByName = "incotermId")
    DemandeClientDTO toDto(DemandeClient s);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);

    @Named("deviseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    DeviseDTO toDtoDeviseId(Devise devise);

    @Named("incotermId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    IncotermDTO toDtoIncotermId(Incoterm incoterm);
}
