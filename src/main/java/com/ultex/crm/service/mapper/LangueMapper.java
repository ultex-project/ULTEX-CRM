package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Langue;
import com.ultex.crm.service.dto.LangueDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Langue} and its DTO {@link LangueDTO}.
 */
@Mapper(componentModel = "spring")
public interface LangueMapper extends EntityMapper<LangueDTO, Langue> {}
