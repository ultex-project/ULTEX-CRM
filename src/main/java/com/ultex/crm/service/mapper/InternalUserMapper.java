package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.InternalUser;
import com.ultex.crm.service.dto.InternalUserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link InternalUser} and its DTO {@link InternalUserDTO}.
 */
@Mapper(componentModel = "spring")
public interface InternalUserMapper extends EntityMapper<InternalUserDTO, InternalUser> {}
