package com.ultex.crm.service;

import com.ultex.crm.domain.Client;
import com.ultex.crm.domain.Client_;
import com.ultex.crm.domain.Company_;
import com.ultex.crm.domain.Contact_;
import com.ultex.crm.domain.KycClient_;
import com.ultex.crm.domain.Opportunity_;
import com.ultex.crm.domain.Prospect_;
import com.ultex.crm.repository.ClientRepository;
import com.ultex.crm.service.criteria.ClientCriteria;
import com.ultex.crm.service.dto.ClientDTO;
import com.ultex.crm.service.mapper.ClientMapper;
import jakarta.persistence.criteria.JoinType;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Client} entities in the database.
 */
@Service
@Transactional(readOnly = true)
public class ClientQueryService extends QueryService<Client> {

    private static final Logger LOG = LoggerFactory.getLogger(ClientQueryService.class);

    private final ClientRepository clientRepository;

    private final ClientMapper clientMapper;

    public ClientQueryService(ClientRepository clientRepository, ClientMapper clientMapper) {
        this.clientRepository = clientRepository;
        this.clientMapper = clientMapper;
    }

    public List<ClientDTO> findByCriteria(ClientCriteria criteria) {
        LOG.debug("find by criteria : {}", criteria);
        final Specification<Client> specification = createSpecification(criteria);
        return clientMapper.toDto(clientRepository.findAll(specification));
    }

    public Page<ClientDTO> findByCriteria(ClientCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Client> specification = createSpecification(criteria);
        return clientRepository.findAll(specification, page).map(clientMapper::toDto);
    }

    public long countByCriteria(ClientCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Client> specification = createSpecification(criteria);
        return clientRepository.count(specification);
    }

    protected Specification<Client> createSpecification(ClientCriteria criteria) {
        Specification<Client> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Client_.id));
            }
            if (criteria.getCode() != null) {
                specification = specification.and(buildStringSpecification(criteria.getCode(), Client_.code));
            }
            if (criteria.getNomComplet() != null) {
                specification = specification.and(buildStringSpecification(criteria.getNomComplet(), Client_.nomComplet));
            }
            if (criteria.getPhotoUrl() != null) {
                specification = specification.and(buildStringSpecification(criteria.getPhotoUrl(), Client_.photoUrl));
            }
            if (criteria.getDateNaissance() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getDateNaissance(), Client_.dateNaissance));
            }
            if (criteria.getLieuNaissance() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLieuNaissance(), Client_.lieuNaissance));
            }
            if (criteria.getNationalite() != null) {
                specification = specification.and(buildStringSpecification(criteria.getNationalite(), Client_.nationalite));
            }
            if (criteria.getGenre() != null) {
                specification = specification.and(buildStringSpecification(criteria.getGenre(), Client_.genre));
            }
            if (criteria.getFonction() != null) {
                specification = specification.and(buildStringSpecification(criteria.getFonction(), Client_.fonction));
            }
            if (criteria.getLanguePreferee() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLanguePreferee(), Client_.languePreferee));
            }
            if (criteria.getTelephonePrincipal() != null) {
                specification = specification.and(buildStringSpecification(criteria.getTelephonePrincipal(), Client_.telephonePrincipal));
            }
            if (criteria.getWhatsapp() != null) {
                specification = specification.and(buildStringSpecification(criteria.getWhatsapp(), Client_.whatsapp));
            }
            if (criteria.getEmail() != null) {
                specification = specification.and(buildStringSpecification(criteria.getEmail(), Client_.email));
            }
            if (criteria.getAdressePersonnelle() != null) {
                specification = specification.and(buildStringSpecification(criteria.getAdressePersonnelle(), Client_.adressePersonnelle));
            }
            if (criteria.getAdressesLivraison() != null) {
                specification = specification.and(buildStringSpecification(criteria.getAdressesLivraison(), Client_.adressesLivraison));
            }
            if (criteria.getReseauxSociaux() != null) {
                specification = specification.and(buildStringSpecification(criteria.getReseauxSociaux(), Client_.reseauxSociaux));
            }
            if (criteria.getCreatedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreatedAt(), Client_.createdAt));
            }
            if (criteria.getUpdatedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getUpdatedAt(), Client_.updatedAt));
            }
            if (criteria.getOpportunitiesId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getOpportunitiesId(), root ->
                        root.join(Client_.opportunities, JoinType.LEFT).get(Opportunity_.id)
                    )
                );
            }
            if (criteria.getCompanyId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getCompanyId(), root -> root.join(Client_.company, JoinType.LEFT).get(Company_.id))
                );
            }
            if (criteria.getConvertedFromProspectId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getConvertedFromProspectId(), root ->
                        root.join(Client_.convertedFromProspect, JoinType.LEFT).get(Prospect_.id)
                    )
                );
            }
            if (criteria.getContactsId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getContactsId(), root -> root.join(Client_.contacts, JoinType.LEFT).get(Contact_.id))
                );
            }
            if (criteria.getKycClientId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getKycClientId(), root -> root.join(Client_.kycClient, JoinType.LEFT).get(KycClient_.id))
                );
            }
        }
        return specification;
    }
}
