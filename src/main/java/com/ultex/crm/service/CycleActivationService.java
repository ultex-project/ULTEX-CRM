package com.ultex.crm.service;

import com.ultex.crm.domain.CycleActivation;
import com.ultex.crm.repository.CycleActivationRepository;
import com.ultex.crm.service.dto.CycleActivationDTO;
import com.ultex.crm.service.mapper.CycleActivationMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.CycleActivation}.
 */
@Service
@Transactional
public class CycleActivationService {

    private static final Logger LOG = LoggerFactory.getLogger(CycleActivationService.class);

    private final CycleActivationRepository cycleActivationRepository;

    private final CycleActivationMapper cycleActivationMapper;

    public CycleActivationService(CycleActivationRepository cycleActivationRepository, CycleActivationMapper cycleActivationMapper) {
        this.cycleActivationRepository = cycleActivationRepository;
        this.cycleActivationMapper = cycleActivationMapper;
    }

    /**
     * Save a cycleActivation.
     *
     * @param cycleActivationDTO the entity to save.
     * @return the persisted entity.
     */
    public CycleActivationDTO save(CycleActivationDTO cycleActivationDTO) {
        LOG.debug("Request to save CycleActivation : {}", cycleActivationDTO);
        CycleActivation cycleActivation = cycleActivationMapper.toEntity(cycleActivationDTO);
        cycleActivation = cycleActivationRepository.save(cycleActivation);
        return cycleActivationMapper.toDto(cycleActivation);
    }

    /**
     * Update a cycleActivation.
     *
     * @param cycleActivationDTO the entity to save.
     * @return the persisted entity.
     */
    public CycleActivationDTO update(CycleActivationDTO cycleActivationDTO) {
        LOG.debug("Request to update CycleActivation : {}", cycleActivationDTO);
        CycleActivation cycleActivation = cycleActivationMapper.toEntity(cycleActivationDTO);
        cycleActivation = cycleActivationRepository.save(cycleActivation);
        return cycleActivationMapper.toDto(cycleActivation);
    }

    /**
     * Partially update a cycleActivation.
     *
     * @param cycleActivationDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<CycleActivationDTO> partialUpdate(CycleActivationDTO cycleActivationDTO) {
        LOG.debug("Request to partially update CycleActivation : {}", cycleActivationDTO);

        return cycleActivationRepository
            .findById(cycleActivationDTO.getId())
            .map(existingCycleActivation -> {
                cycleActivationMapper.partialUpdate(existingCycleActivation, cycleActivationDTO);

                return existingCycleActivation;
            })
            .map(cycleActivationRepository::save)
            .map(cycleActivationMapper::toDto);
    }

    /**
     * Get all the cycleActivations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<CycleActivationDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all CycleActivations");
        return cycleActivationRepository.findAll(pageable).map(cycleActivationMapper::toDto);
    }

    /**
     * Get one cycleActivation by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<CycleActivationDTO> findOne(Long id) {
        LOG.debug("Request to get CycleActivation : {}", id);
        return cycleActivationRepository.findById(id).map(cycleActivationMapper::toDto);
    }

    /**
     * Delete the cycleActivation by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete CycleActivation : {}", id);
        cycleActivationRepository.deleteById(id);
    }
}
