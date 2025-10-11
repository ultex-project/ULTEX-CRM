package com.ultex.crm.service;

import com.ultex.crm.domain.Devise;
import com.ultex.crm.repository.DeviseRepository;
import com.ultex.crm.service.dto.DeviseDTO;
import com.ultex.crm.service.mapper.DeviseMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.Devise}.
 */
@Service
@Transactional
public class DeviseService {

    private static final Logger LOG = LoggerFactory.getLogger(DeviseService.class);

    private final DeviseRepository deviseRepository;

    private final DeviseMapper deviseMapper;

    public DeviseService(DeviseRepository deviseRepository, DeviseMapper deviseMapper) {
        this.deviseRepository = deviseRepository;
        this.deviseMapper = deviseMapper;
    }

    /**
     * Save a devise.
     *
     * @param deviseDTO the entity to save.
     * @return the persisted entity.
     */
    public DeviseDTO save(DeviseDTO deviseDTO) {
        LOG.debug("Request to save Devise : {}", deviseDTO);
        Devise devise = deviseMapper.toEntity(deviseDTO);
        devise = deviseRepository.save(devise);
        return deviseMapper.toDto(devise);
    }

    /**
     * Update a devise.
     *
     * @param deviseDTO the entity to save.
     * @return the persisted entity.
     */
    public DeviseDTO update(DeviseDTO deviseDTO) {
        LOG.debug("Request to update Devise : {}", deviseDTO);
        Devise devise = deviseMapper.toEntity(deviseDTO);
        devise = deviseRepository.save(devise);
        return deviseMapper.toDto(devise);
    }

    /**
     * Partially update a devise.
     *
     * @param deviseDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<DeviseDTO> partialUpdate(DeviseDTO deviseDTO) {
        LOG.debug("Request to partially update Devise : {}", deviseDTO);

        return deviseRepository
            .findById(deviseDTO.getId())
            .map(existingDevise -> {
                deviseMapper.partialUpdate(existingDevise, deviseDTO);

                return existingDevise;
            })
            .map(deviseRepository::save)
            .map(deviseMapper::toDto);
    }

    /**
     * Get all the devises.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<DeviseDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Devises");
        return deviseRepository.findAll(pageable).map(deviseMapper::toDto);
    }

    /**
     * Get one devise by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<DeviseDTO> findOne(Long id) {
        LOG.debug("Request to get Devise : {}", id);
        return deviseRepository.findById(id).map(deviseMapper::toDto);
    }

    /**
     * Delete the devise by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Devise : {}", id);
        deviseRepository.deleteById(id);
    }
}
