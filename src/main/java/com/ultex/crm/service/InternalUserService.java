package com.ultex.crm.service;

import com.ultex.crm.domain.InternalUser;
import com.ultex.crm.repository.InternalUserRepository;
import com.ultex.crm.service.dto.InternalUserDTO;
import com.ultex.crm.service.mapper.InternalUserMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.InternalUser}.
 */
@Service
@Transactional
public class InternalUserService {

    private static final Logger LOG = LoggerFactory.getLogger(InternalUserService.class);

    private final InternalUserRepository internalUserRepository;

    private final InternalUserMapper internalUserMapper;

    public InternalUserService(InternalUserRepository internalUserRepository, InternalUserMapper internalUserMapper) {
        this.internalUserRepository = internalUserRepository;
        this.internalUserMapper = internalUserMapper;
    }

    /**
     * Save a internalUser.
     *
     * @param internalUserDTO the entity to save.
     * @return the persisted entity.
     */
    public InternalUserDTO save(InternalUserDTO internalUserDTO) {
        LOG.debug("Request to save InternalUser : {}", internalUserDTO);
        InternalUser internalUser = internalUserMapper.toEntity(internalUserDTO);
        internalUser = internalUserRepository.save(internalUser);
        return internalUserMapper.toDto(internalUser);
    }

    /**
     * Update a internalUser.
     *
     * @param internalUserDTO the entity to save.
     * @return the persisted entity.
     */
    public InternalUserDTO update(InternalUserDTO internalUserDTO) {
        LOG.debug("Request to update InternalUser : {}", internalUserDTO);
        InternalUser internalUser = internalUserMapper.toEntity(internalUserDTO);
        internalUser = internalUserRepository.save(internalUser);
        return internalUserMapper.toDto(internalUser);
    }

    /**
     * Partially update a internalUser.
     *
     * @param internalUserDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<InternalUserDTO> partialUpdate(InternalUserDTO internalUserDTO) {
        LOG.debug("Request to partially update InternalUser : {}", internalUserDTO);

        return internalUserRepository
            .findById(internalUserDTO.getId())
            .map(existingInternalUser -> {
                internalUserMapper.partialUpdate(existingInternalUser, internalUserDTO);

                return existingInternalUser;
            })
            .map(internalUserRepository::save)
            .map(internalUserMapper::toDto);
    }

    /**
     * Get all the internalUsers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<InternalUserDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all InternalUsers");
        return internalUserRepository.findAll(pageable).map(internalUserMapper::toDto);
    }

    /**
     * Get one internalUser by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<InternalUserDTO> findOne(Long id) {
        LOG.debug("Request to get InternalUser : {}", id);
        return internalUserRepository.findById(id).map(internalUserMapper::toDto);
    }

    /**
     * Delete the internalUser by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete InternalUser : {}", id);
        internalUserRepository.deleteById(id);
    }
}
