package com.ultex.crm.service;

import com.ultex.crm.domain.EtatInteraction;
import com.ultex.crm.repository.EtatInteractionRepository;
import com.ultex.crm.service.dto.EtatInteractionDTO;
import com.ultex.crm.service.mapper.EtatInteractionMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.EtatInteraction}.
 */
@Service
@Transactional
public class EtatInteractionService {

    private static final Logger LOG = LoggerFactory.getLogger(EtatInteractionService.class);

    private final EtatInteractionRepository etatInteractionRepository;

    private final EtatInteractionMapper etatInteractionMapper;

    public EtatInteractionService(EtatInteractionRepository etatInteractionRepository, EtatInteractionMapper etatInteractionMapper) {
        this.etatInteractionRepository = etatInteractionRepository;
        this.etatInteractionMapper = etatInteractionMapper;
    }

    /**
     * Save a etatInteraction.
     *
     * @param etatInteractionDTO the entity to save.
     * @return the persisted entity.
     */
    public EtatInteractionDTO save(EtatInteractionDTO etatInteractionDTO) {
        LOG.debug("Request to save EtatInteraction : {}", etatInteractionDTO);
        EtatInteraction etatInteraction = etatInteractionMapper.toEntity(etatInteractionDTO);
        etatInteraction = etatInteractionRepository.save(etatInteraction);
        return etatInteractionMapper.toDto(etatInteraction);
    }

    /**
     * Update a etatInteraction.
     *
     * @param etatInteractionDTO the entity to save.
     * @return the persisted entity.
     */
    public EtatInteractionDTO update(EtatInteractionDTO etatInteractionDTO) {
        LOG.debug("Request to update EtatInteraction : {}", etatInteractionDTO);
        EtatInteraction etatInteraction = etatInteractionMapper.toEntity(etatInteractionDTO);
        etatInteraction = etatInteractionRepository.save(etatInteraction);
        return etatInteractionMapper.toDto(etatInteraction);
    }

    /**
     * Partially update a etatInteraction.
     *
     * @param etatInteractionDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<EtatInteractionDTO> partialUpdate(EtatInteractionDTO etatInteractionDTO) {
        LOG.debug("Request to partially update EtatInteraction : {}", etatInteractionDTO);

        return etatInteractionRepository
            .findById(etatInteractionDTO.getId())
            .map(existingEtatInteraction -> {
                etatInteractionMapper.partialUpdate(existingEtatInteraction, etatInteractionDTO);

                return existingEtatInteraction;
            })
            .map(etatInteractionRepository::save)
            .map(etatInteractionMapper::toDto);
    }

    /**
     * Get all the etatInteractions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<EtatInteractionDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all EtatInteractions");
        return etatInteractionRepository.findAll(pageable).map(etatInteractionMapper::toDto);
    }

    /**
     * Get one etatInteraction by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<EtatInteractionDTO> findOne(Long id) {
        LOG.debug("Request to get EtatInteraction : {}", id);
        return etatInteractionRepository.findById(id).map(etatInteractionMapper::toDto);
    }

    /**
     * Delete the etatInteraction by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete EtatInteraction : {}", id);
        etatInteractionRepository.deleteById(id);
    }
}
