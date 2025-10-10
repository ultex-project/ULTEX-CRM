package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.KycClient;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.KycClientDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link KycClient} and its DTO {@link KycClientDTO}.
 */
@Mapper(componentModel = "spring")
public interface KycClientMapper extends EntityMapper<KycClientDTO, KycClient> {
    @Mapping(target = "client", source = "client", qualifiedByName = "clientId")
    KycClientDTO toDto(KycClient s);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);
}
