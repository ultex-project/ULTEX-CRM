package com.ultex.crm.service;

import com.ultex.crm.domain.Opportunity;
import com.ultex.crm.repository.OpportunityRepository;
import com.ultex.crm.service.dto.OpportunityDTO;
import com.ultex.crm.service.mapper.OpportunityMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.Opportunity}.
 */
@Service
@Transactional
public class OpportunityService {

    private static final Logger LOG = LoggerFactory.getLogger(OpportunityService.class);

    private final OpportunityRepository opportunityRepository;

    private final OpportunityMapper opportunityMapper;

    public OpportunityService(OpportunityRepository opportunityRepository, OpportunityMapper opportunityMapper) {
        this.opportunityRepository = opportunityRepository;
        this.opportunityMapper = opportunityMapper;
    }

    /**
     * Save a opportunity.
     *
     * @param opportunityDTO the entity to save.
     * @return the persisted entity.
     */
    public OpportunityDTO save(OpportunityDTO opportunityDTO) {
        LOG.debug("Request to save Opportunity : {}", opportunityDTO);
        Opportunity opportunity = opportunityMapper.toEntity(opportunityDTO);
        opportunity = opportunityRepository.save(opportunity);
        return opportunityMapper.toDto(opportunity);
    }

    /**
     * Update a opportunity.
     *
     * @param opportunityDTO the entity to save.
     * @return the persisted entity.
     */
    public OpportunityDTO update(OpportunityDTO opportunityDTO) {
        LOG.debug("Request to update Opportunity : {}", opportunityDTO);
        Opportunity opportunity = opportunityMapper.toEntity(opportunityDTO);
        opportunity = opportunityRepository.save(opportunity);
        return opportunityMapper.toDto(opportunity);
    }

    /**
     * Partially update a opportunity.
     *
     * @param opportunityDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<OpportunityDTO> partialUpdate(OpportunityDTO opportunityDTO) {
        LOG.debug("Request to partially update Opportunity : {}", opportunityDTO);

        return opportunityRepository
            .findById(opportunityDTO.getId())
            .map(existingOpportunity -> {
                opportunityMapper.partialUpdate(existingOpportunity, opportunityDTO);

                return existingOpportunity;
            })
            .map(opportunityRepository::save)
            .map(opportunityMapper::toDto);
    }

    /**
     * Get all the opportunities.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<OpportunityDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Opportunities");
        return opportunityRepository.findAll(pageable).map(opportunityMapper::toDto);
    }

    /**
     * Get one opportunity by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<OpportunityDTO> findOne(Long id) {
        LOG.debug("Request to get Opportunity : {}", id);
        return opportunityRepository.findById(id).map(opportunityMapper::toDto);
    }

    /**
     * Delete the opportunity by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Opportunity : {}", id);
        opportunityRepository.deleteById(id);
    }
}
