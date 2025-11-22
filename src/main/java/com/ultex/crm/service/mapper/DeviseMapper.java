package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Devise;
import com.ultex.crm.service.dto.DeviseDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Devise} and its DTO {@link DeviseDTO}.
 */
@Mapper(componentModel = "spring")
public interface DeviseMapper extends EntityMapper<DeviseDTO, Devise> {}
