package com.ultex.crm.service;

import com.ultex.crm.domain.Client_;
import com.ultex.crm.domain.Company_;
import com.ultex.crm.domain.Contact_;
import com.ultex.crm.domain.InternalUser_;
import com.ultex.crm.domain.Prospect;
import com.ultex.crm.domain.Prospect_;
import com.ultex.crm.repository.ProspectRepository;
import com.ultex.crm.service.criteria.ProspectCriteria;
import com.ultex.crm.service.dto.ProspectDTO;
import com.ultex.crm.service.mapper.ProspectMapper;
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
 * Service for executing complex queries for {@link Prospect} entities in the database.
 * The main input is a {@link ProspectCriteria} which gets converted to {@link Specification},
 * in such a way that all the filters must apply.
 */
@Service
@Transactional(readOnly = true)
public class ProspectQueryService extends QueryService<Prospect> {

    private static final Logger LOG = LoggerFactory.getLogger(ProspectQueryService.class);

    private final ProspectRepository prospectRepository;

    private final ProspectMapper prospectMapper;

    public ProspectQueryService(ProspectRepository prospectRepository, ProspectMapper prospectMapper) {
        this.prospectRepository = prospectRepository;
        this.prospectMapper = prospectMapper;
    }

    /**
     * Return a {@link List} of {@link ProspectDTO} which matches the criteria from the database.
     *
     * @param criteria The filtering criteria.
     * @return the matching entities as DTOs.
     */
    public List<ProspectDTO> findByCriteria(ProspectCriteria criteria) {
        LOG.debug("find by criteria : {}", criteria);
        final Specification<Prospect> specification = createSpecification(criteria);
        return prospectMapper.toDto(prospectRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link ProspectDTO} which matches the criteria from the database.
     *
     * @param criteria The filtering criteria.
     * @param page The page to return.
     * @return the matching entities as DTOs.
     */
    public Page<ProspectDTO> findByCriteria(ProspectCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Prospect> specification = createSpecification(criteria);
        return prospectRepository.findAll(specification, page).map(prospectMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     *
     * @param criteria The filtering criteria.
     * @return the count of matching entities.
     */
    public long countByCriteria(ProspectCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Prospect> specification = createSpecification(criteria);
        return prospectRepository.count(specification);
    }

    protected Specification<Prospect> createSpecification(ProspectCriteria criteria) {
        Specification<Prospect> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Prospect_.id));
            }
            if (criteria.getFirstName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getFirstName(), Prospect_.firstName));
            }
            if (criteria.getLastName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLastName(), Prospect_.lastName));
            }
            if (criteria.getEmail() != null) {
                specification = specification.and(buildStringSpecification(criteria.getEmail(), Prospect_.email));
            }
            if (criteria.getPhone1() != null) {
                specification = specification.and(buildStringSpecification(criteria.getPhone1(), Prospect_.phone1));
            }
            if (criteria.getPhone2() != null) {
                specification = specification.and(buildStringSpecification(criteria.getPhone2(), Prospect_.phone2));
            }
            if (criteria.getSource() != null) {
                specification = specification.and(buildStringSpecification(criteria.getSource(), Prospect_.source));
            }
            if (criteria.getCin() != null) {
                specification = specification.and(buildStringSpecification(criteria.getCin(), Prospect_.cin));
            }
            if (criteria.getAddress() != null) {
                specification = specification.and(buildStringSpecification(criteria.getAddress(), Prospect_.address));
            }
            if (criteria.getCity() != null) {
                specification = specification.and(buildStringSpecification(criteria.getCity(), Prospect_.city));
            }
            if (criteria.getCountry() != null) {
                specification = specification.and(buildStringSpecification(criteria.getCountry(), Prospect_.country));
            }
            if (criteria.getDeliveryAddress() != null) {
                specification = specification.and(buildStringSpecification(criteria.getDeliveryAddress(), Prospect_.deliveryAddress));
            }
            if (criteria.getReferredBy() != null) {
                specification = specification.and(buildStringSpecification(criteria.getReferredBy(), Prospect_.referredBy));
            }
            if (criteria.getStatus() != null) {
                specification = specification.and(buildSpecification(criteria.getStatus(), Prospect_.status));
            }
            if (criteria.getConvertedDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getConvertedDate(), Prospect_.convertedDate));
            }
            if (criteria.getCreatedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreatedAt(), Prospect_.createdAt));
            }
            if (criteria.getUpdatedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getUpdatedAt(), Prospect_.updatedAt));
            }
            if (criteria.getConvertedToId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getConvertedToId(), root -> root.join(Prospect_.convertedTo, JoinType.LEFT).get(Client_.id))
                );
            }
            if (criteria.getConvertedById() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getConvertedById(), root ->
                        root.join(Prospect_.convertedBy, JoinType.LEFT).get(InternalUser_.id)
                    )
                );
            }
            if (criteria.getCompanyId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getCompanyId(), root -> root.join(Prospect_.company, JoinType.LEFT).get(Company_.id))
                );
            }
            if (criteria.getContactsId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getContactsId(), root -> root.join(Prospect_.contacts, JoinType.LEFT).get(Contact_.id))
                );
            }
        }
        return specification;
    }
}
