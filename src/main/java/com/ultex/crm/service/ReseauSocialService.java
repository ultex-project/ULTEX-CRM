package com.ultex.crm.service;

import com.ultex.crm.domain.ReseauSocial;
import com.ultex.crm.repository.ReseauSocialRepository;
import com.ultex.crm.service.dto.ReseauSocialDTO;
import com.ultex.crm.service.mapper.ReseauSocialMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.ReseauSocial}.
 */
@Service
@Transactional
public class ReseauSocialService {

    private static final Logger LOG = LoggerFactory.getLogger(ReseauSocialService.class);

    private final ReseauSocialRepository reseauSocialRepository;

    private final ReseauSocialMapper reseauSocialMapper;

    public ReseauSocialService(ReseauSocialRepository reseauSocialRepository, ReseauSocialMapper reseauSocialMapper) {
        this.reseauSocialRepository = reseauSocialRepository;
        this.reseauSocialMapper = reseauSocialMapper;
    }

    /**
     * Save a reseauSocial.
     *
     * @param reseauSocialDTO the entity to save.
     * @return the persisted entity.
     */
    public ReseauSocialDTO save(ReseauSocialDTO reseauSocialDTO) {
        LOG.debug("Request to save ReseauSocial : {}", reseauSocialDTO);
        ReseauSocial reseauSocial = reseauSocialMapper.toEntity(reseauSocialDTO);
        reseauSocial = reseauSocialRepository.save(reseauSocial);
        return reseauSocialMapper.toDto(reseauSocial);
    }

    /**
     * Update a reseauSocial.
     *
     * @param reseauSocialDTO the entity to save.
     * @return the persisted entity.
     */
    public ReseauSocialDTO update(ReseauSocialDTO reseauSocialDTO) {
        LOG.debug("Request to update ReseauSocial : {}", reseauSocialDTO);
        ReseauSocial reseauSocial = reseauSocialMapper.toEntity(reseauSocialDTO);
        reseauSocial = reseauSocialRepository.save(reseauSocial);
        return reseauSocialMapper.toDto(reseauSocial);
    }

    /**
     * Partially update a reseauSocial.
     *
     * @param reseauSocialDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ReseauSocialDTO> partialUpdate(ReseauSocialDTO reseauSocialDTO) {
        LOG.debug("Request to partially update ReseauSocial : {}", reseauSocialDTO);

        return reseauSocialRepository
            .findById(reseauSocialDTO.getId())
            .map(existingReseauSocial -> {
                reseauSocialMapper.partialUpdate(existingReseauSocial, reseauSocialDTO);

                return existingReseauSocial;
            })
            .map(reseauSocialRepository::save)
            .map(reseauSocialMapper::toDto);
    }

    /**
     * Get all the reseauSocials.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ReseauSocialDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all ReseauSocials");
        return reseauSocialRepository.findAll(pageable).map(reseauSocialMapper::toDto);
    }

    /**
     * Get one reseauSocial by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ReseauSocialDTO> findOne(Long id) {
        LOG.debug("Request to get ReseauSocial : {}", id);
        return reseauSocialRepository.findById(id).map(reseauSocialMapper::toDto);
    }

    /**
     * Delete the reseauSocial by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ReseauSocial : {}", id);
        reseauSocialRepository.deleteById(id);
    }
}
