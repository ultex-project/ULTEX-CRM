package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.ReseauSocial;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.ReseauSocialDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ReseauSocial} and its DTO {@link ReseauSocialDTO}.
 */
@Mapper(componentModel = "spring")
public interface ReseauSocialMapper extends EntityMapper<ReseauSocialDTO, ReseauSocial> {
    @Mapping(target = "client", source = "client", qualifiedByName = "clientId")
    ReseauSocialDTO toDto(ReseauSocial s);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);
}
