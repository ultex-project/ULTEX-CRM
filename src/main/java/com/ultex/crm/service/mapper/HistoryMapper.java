package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.History;
import com.ultex.crm.service.dto.HistoryDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link History} and its DTO {@link HistoryDTO}.
 */
@Mapper(componentModel = "spring")
public interface HistoryMapper extends EntityMapper<HistoryDTO, History> {}
