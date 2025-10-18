package com.ultex.crm.service;

import com.ultex.crm.domain.RappelAgent;
import com.ultex.crm.repository.RappelAgentRepository;
import com.ultex.crm.service.dto.RappelAgentDTO;
import com.ultex.crm.service.mapper.RappelAgentMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.RappelAgent}.
 */
@Service
@Transactional
public class RappelAgentService {

    private static final Logger LOG = LoggerFactory.getLogger(RappelAgentService.class);

    private final RappelAgentRepository rappelAgentRepository;

    private final RappelAgentMapper rappelAgentMapper;

    public RappelAgentService(RappelAgentRepository rappelAgentRepository, RappelAgentMapper rappelAgentMapper) {
        this.rappelAgentRepository = rappelAgentRepository;
        this.rappelAgentMapper = rappelAgentMapper;
    }

    /**
     * Save a rappelAgent.
     *
     * @param rappelAgentDTO the entity to save.
     * @return the persisted entity.
     */
    public RappelAgentDTO save(RappelAgentDTO rappelAgentDTO) {
        LOG.debug("Request to save RappelAgent : {}", rappelAgentDTO);
        RappelAgent rappelAgent = rappelAgentMapper.toEntity(rappelAgentDTO);
        rappelAgent = rappelAgentRepository.save(rappelAgent);
        return rappelAgentMapper.toDto(rappelAgent);
    }

    /**
     * Update a rappelAgent.
     *
     * @param rappelAgentDTO the entity to save.
     * @return the persisted entity.
     */
    public RappelAgentDTO update(RappelAgentDTO rappelAgentDTO) {
        LOG.debug("Request to update RappelAgent : {}", rappelAgentDTO);
        RappelAgent rappelAgent = rappelAgentMapper.toEntity(rappelAgentDTO);
        rappelAgent = rappelAgentRepository.save(rappelAgent);
        return rappelAgentMapper.toDto(rappelAgent);
    }

    /**
     * Partially update a rappelAgent.
     *
     * @param rappelAgentDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<RappelAgentDTO> partialUpdate(RappelAgentDTO rappelAgentDTO) {
        LOG.debug("Request to partially update RappelAgent : {}", rappelAgentDTO);

        return rappelAgentRepository
            .findById(rappelAgentDTO.getId())
            .map(existingRappelAgent -> {
                rappelAgentMapper.partialUpdate(existingRappelAgent, rappelAgentDTO);

                return existingRappelAgent;
            })
            .map(rappelAgentRepository::save)
            .map(rappelAgentMapper::toDto);
    }

    /**
     * Get all the rappelAgents.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<RappelAgentDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all RappelAgents");
        return rappelAgentRepository.findAll(pageable).map(rappelAgentMapper::toDto);
    }

    /**
     * Get one rappelAgent by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<RappelAgentDTO> findOne(Long id) {
        LOG.debug("Request to get RappelAgent : {}", id);
        return rappelAgentRepository.findById(id).map(rappelAgentMapper::toDto);
    }

    /**
     * Delete the rappelAgent by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete RappelAgent : {}", id);
        rappelAgentRepository.deleteById(id);
    }
}
