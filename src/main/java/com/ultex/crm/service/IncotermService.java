package com.ultex.crm.service;

import com.ultex.crm.domain.Incoterm;
import com.ultex.crm.repository.IncotermRepository;
import com.ultex.crm.service.dto.IncotermDTO;
import com.ultex.crm.service.mapper.IncotermMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.Incoterm}.
 */
@Service
@Transactional
public class IncotermService {

    private static final Logger LOG = LoggerFactory.getLogger(IncotermService.class);

    private final IncotermRepository incotermRepository;

    private final IncotermMapper incotermMapper;

    public IncotermService(IncotermRepository incotermRepository, IncotermMapper incotermMapper) {
        this.incotermRepository = incotermRepository;
        this.incotermMapper = incotermMapper;
    }

    /**
     * Save a incoterm.
     *
     * @param incotermDTO the entity to save.
     * @return the persisted entity.
     */
    public IncotermDTO save(IncotermDTO incotermDTO) {
        LOG.debug("Request to save Incoterm : {}", incotermDTO);
        Incoterm incoterm = incotermMapper.toEntity(incotermDTO);
        incoterm = incotermRepository.save(incoterm);
        return incotermMapper.toDto(incoterm);
    }

    /**
     * Update a incoterm.
     *
     * @param incotermDTO the entity to save.
     * @return the persisted entity.
     */
    public IncotermDTO update(IncotermDTO incotermDTO) {
        LOG.debug("Request to update Incoterm : {}", incotermDTO);
        Incoterm incoterm = incotermMapper.toEntity(incotermDTO);
        incoterm = incotermRepository.save(incoterm);
        return incotermMapper.toDto(incoterm);
    }

    /**
     * Partially update a incoterm.
     *
     * @param incotermDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<IncotermDTO> partialUpdate(IncotermDTO incotermDTO) {
        LOG.debug("Request to partially update Incoterm : {}", incotermDTO);

        return incotermRepository
            .findById(incotermDTO.getId())
            .map(existingIncoterm -> {
                incotermMapper.partialUpdate(existingIncoterm, incotermDTO);

                return existingIncoterm;
            })
            .map(incotermRepository::save)
            .map(incotermMapper::toDto);
    }

    /**
     * Get all the incoterms.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<IncotermDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Incoterms");
        return incotermRepository.findAll(pageable).map(incotermMapper::toDto);
    }

    /**
     * Get one incoterm by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<IncotermDTO> findOne(Long id) {
        LOG.debug("Request to get Incoterm : {}", id);
        return incotermRepository.findById(id).map(incotermMapper::toDto);
    }

    /**
     * Delete the incoterm by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Incoterm : {}", id);
        incotermRepository.deleteById(id);
    }
}
