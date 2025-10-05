package com.ultex.crm.service.mapper;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.Company;
import com.ultex.crm.domain.Contact;
import com.ultex.crm.domain.Prospect;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.dto.CompanyDTO;
import com.ultex.crm.service.dto.ContactDTO;
import com.ultex.crm.service.dto.ProspectDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Contact} and its DTO {@link ContactDTO}.
 */
@Mapper(componentModel = "spring")
public interface ContactMapper extends EntityMapper<ContactDTO, Contact> {
    @Mapping(target = "company", source = "company", qualifiedByName = "companyId")
    @Mapping(target = "client", source = "client", qualifiedByName = "clientId")
    @Mapping(target = "prospect", source = "prospect", qualifiedByName = "prospectId")
    ContactDTO toDto(Contact s);

    @Named("companyId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CompanyDTO toDtoCompanyId(Company company);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);

    @Named("prospectId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ProspectDTO toDtoProspectId(Prospect prospect);
}
