package com.ultex.crm.service;

import com.ultex.crm.domain.SousService;
import com.ultex.crm.repository.SousServiceRepository;
import com.ultex.crm.service.dto.SousServiceDTO;
import com.ultex.crm.service.mapper.SousServiceMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.SousService}.
 */
@Service
@Transactional
public class SousServiceService {

    private static final Logger LOG = LoggerFactory.getLogger(SousServiceService.class);

    private final SousServiceRepository sousServiceRepository;

    private final SousServiceMapper sousServiceMapper;

    public SousServiceService(SousServiceRepository sousServiceRepository, SousServiceMapper sousServiceMapper) {
        this.sousServiceRepository = sousServiceRepository;
        this.sousServiceMapper = sousServiceMapper;
    }

    /**
     * Save a sousService.
     *
     * @param sousServiceDTO the entity to save.
     * @return the persisted entity.
     */
    public SousServiceDTO save(SousServiceDTO sousServiceDTO) {
        LOG.debug("Request to save SousService : {}", sousServiceDTO);
        SousService sousService = sousServiceMapper.toEntity(sousServiceDTO);
        sousService = sousServiceRepository.save(sousService);
        return sousServiceMapper.toDto(sousService);
    }

    /**
     * Update a sousService.
     *
     * @param sousServiceDTO the entity to save.
     * @return the persisted entity.
     */
    public SousServiceDTO update(SousServiceDTO sousServiceDTO) {
        LOG.debug("Request to update SousService : {}", sousServiceDTO);
        SousService sousService = sousServiceMapper.toEntity(sousServiceDTO);
        sousService = sousServiceRepository.save(sousService);
        return sousServiceMapper.toDto(sousService);
    }

    /**
     * Partially update a sousService.
     *
     * @param sousServiceDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<SousServiceDTO> partialUpdate(SousServiceDTO sousServiceDTO) {
        LOG.debug("Request to partially update SousService : {}", sousServiceDTO);

        return sousServiceRepository
            .findById(sousServiceDTO.getId())
            .map(existingSousService -> {
                sousServiceMapper.partialUpdate(existingSousService, sousServiceDTO);

                return existingSousService;
            })
            .map(sousServiceRepository::save)
            .map(sousServiceMapper::toDto);
    }

    /**
     * Get all the sousServices.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<SousServiceDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all SousServices");
        return sousServiceRepository.findAll(pageable).map(sousServiceMapper::toDto);
    }

    /**
     * Get one sousService by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<SousServiceDTO> findOne(Long id) {
        LOG.debug("Request to get SousService : {}", id);
        return sousServiceRepository.findById(id).map(sousServiceMapper::toDto);
    }

    /**
     * Delete the sousService by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete SousService : {}", id);
        sousServiceRepository.deleteById(id);
    }
}
