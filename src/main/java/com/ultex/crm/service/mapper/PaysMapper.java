package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Pays;
import com.ultex.crm.service.dto.PaysDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Pays} and its DTO {@link PaysDTO}.
 */
@Mapper(componentModel = "spring")
public interface PaysMapper extends EntityMapper<PaysDTO, Pays> {}
