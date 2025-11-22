package com.ultex.crm.service;

import com.ultex.crm.domain.Pays;
import com.ultex.crm.repository.PaysRepository;
import com.ultex.crm.service.dto.PaysDTO;
import com.ultex.crm.service.mapper.PaysMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.Pays}.
 */
@Service
@Transactional
public class PaysService {

    private static final Logger LOG = LoggerFactory.getLogger(PaysService.class);

    private final PaysRepository paysRepository;

    private final PaysMapper paysMapper;

    public PaysService(PaysRepository paysRepository, PaysMapper paysMapper) {
        this.paysRepository = paysRepository;
        this.paysMapper = paysMapper;
    }

    /**
     * Save a pays.
     *
     * @param paysDTO the entity to save.
     * @return the persisted entity.
     */
    public PaysDTO save(PaysDTO paysDTO) {
        LOG.debug("Request to save Pays : {}", paysDTO);
        Pays pays = paysMapper.toEntity(paysDTO);
        pays = paysRepository.save(pays);
        return paysMapper.toDto(pays);
    }

    /**
     * Update a pays.
     *
     * @param paysDTO the entity to save.
     * @return the persisted entity.
     */
    public PaysDTO update(PaysDTO paysDTO) {
        LOG.debug("Request to update Pays : {}", paysDTO);
        Pays pays = paysMapper.toEntity(paysDTO);
        pays = paysRepository.save(pays);
        return paysMapper.toDto(pays);
    }

    /**
     * Partially update a pays.
     *
     * @param paysDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<PaysDTO> partialUpdate(PaysDTO paysDTO) {
        LOG.debug("Request to partially update Pays : {}", paysDTO);

        return paysRepository
            .findById(paysDTO.getId())
            .map(existingPays -> {
                paysMapper.partialUpdate(existingPays, paysDTO);

                return existingPays;
            })
            .map(paysRepository::save)
            .map(paysMapper::toDto);
    }

    /**
     * Get all the pays.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<PaysDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Pays");
        return paysRepository.findAll(pageable).map(paysMapper::toDto);
    }

    /**
     * Get one pays by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PaysDTO> findOne(Long id) {
        LOG.debug("Request to get Pays : {}", id);
        return paysRepository.findById(id).map(paysMapper::toDto);
    }

    /**
     * Delete the pays by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Pays : {}", id);
        paysRepository.deleteById(id);
    }
}
