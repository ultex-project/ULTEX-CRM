package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Incoterm;
import com.ultex.crm.service.dto.IncotermDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Incoterm} and its DTO {@link IncotermDTO}.
 */
@Mapper(componentModel = "spring")
public interface IncotermMapper extends EntityMapper<IncotermDTO, Incoterm> {}
