package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.SocieteLiee;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.SocieteLieeDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link SocieteLiee} and its DTO {@link SocieteLieeDTO}.
 */
@Mapper(componentModel = "spring")
public interface SocieteLieeMapper extends EntityMapper<SocieteLieeDTO, SocieteLiee> {
    @Mapping(target = "client", source = "client", qualifiedByName = "clientId")
    SocieteLieeDTO toDto(SocieteLiee s);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);
}
