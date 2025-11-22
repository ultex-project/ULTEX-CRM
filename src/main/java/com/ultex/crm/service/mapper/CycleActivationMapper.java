package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.CycleActivation;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.CycleActivationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link CycleActivation} and its DTO {@link CycleActivationDTO}.
 */
@Mapper(componentModel = "spring")
public interface CycleActivationMapper extends EntityMapper<CycleActivationDTO, CycleActivation> {
    @Mapping(target = "client", source = "client", qualifiedByName = "clientId")
    CycleActivationDTO toDto(CycleActivation s);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);
}
