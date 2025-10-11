package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.Company;
import com.ultex.crm.domain.Pays;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.CompanyDTO;
import com.ultex.crm.service.dto.PaysDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Client} and its DTO {@link ClientDTO}.
 */
@Mapper(componentModel = "spring")
public interface ClientMapper extends EntityMapper<ClientDTO, Client> {
    @Mapping(target = "pays", source = "pays", qualifiedByName = "paysId")
    @Mapping(target = "company", source = "company", qualifiedByName = "companyId")
    ClientDTO toDto(Client s);

    @Named("paysId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PaysDTO toDtoPaysId(Pays pays);

    @Named("companyId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CompanyDTO toDtoCompanyId(Company company);
}
