package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.HistoriqueCRM;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.HistoriqueCRMDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link HistoriqueCRM} and its DTO {@link HistoriqueCRMDTO}.
 */
@Mapper(componentModel = "spring")
public interface HistoriqueCRMMapper extends EntityMapper<HistoriqueCRMDTO, HistoriqueCRM> {
    @Mapping(target = "client", source = "client", qualifiedByName = "clientId")
    HistoriqueCRMDTO toDto(HistoriqueCRM s);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);
}
