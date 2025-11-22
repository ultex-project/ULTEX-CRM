package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.CycleActivation;
import com.ultex.crm.domain.EtatInteraction;
import com.ultex.crm.domain.HistoriqueCRM;
import com.ultex.crm.service.dto.CycleActivationDTO;
import com.ultex.crm.service.dto.EtatInteractionDTO;
import com.ultex.crm.service.dto.HistoriqueCRMDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link EtatInteraction} and its DTO {@link EtatInteractionDTO}.
 */
@Mapper(componentModel = "spring")
public interface EtatInteractionMapper extends EntityMapper<EtatInteractionDTO, EtatInteraction> {
    @Mapping(target = "historique", source = "historique", qualifiedByName = "historiqueCRMId")
    @Mapping(target = "cycle", source = "cycle", qualifiedByName = "cycleActivationId")
    EtatInteractionDTO toDto(EtatInteraction s);

    @Named("historiqueCRMId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    HistoriqueCRMDTO toDtoHistoriqueCRMId(HistoriqueCRM historiqueCRM);

    @Named("cycleActivationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CycleActivationDTO toDtoCycleActivationId(CycleActivation cycleActivation);
}
