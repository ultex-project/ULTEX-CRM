package com.ultex.crm.service;

import com.ultex.crm.domain.HistoriqueCRM;
import com.ultex.crm.repository.HistoriqueCRMRepository;
import com.ultex.crm.service.dto.HistoriqueCRMDTO;
import com.ultex.crm.service.mapper.HistoriqueCRMMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.HistoriqueCRM}.
 */
@Service
@Transactional
public class HistoriqueCRMService {

    private static final Logger LOG = LoggerFactory.getLogger(HistoriqueCRMService.class);

    private final HistoriqueCRMRepository historiqueCRMRepository;

    private final HistoriqueCRMMapper historiqueCRMMapper;

    public HistoriqueCRMService(HistoriqueCRMRepository historiqueCRMRepository, HistoriqueCRMMapper historiqueCRMMapper) {
        this.historiqueCRMRepository = historiqueCRMRepository;
        this.historiqueCRMMapper = historiqueCRMMapper;
    }

    /**
     * Save a historiqueCRM.
     *
     * @param historiqueCRMDTO the entity to save.
     * @return the persisted entity.
     */
    public HistoriqueCRMDTO save(HistoriqueCRMDTO historiqueCRMDTO) {
        LOG.debug("Request to save HistoriqueCRM : {}", historiqueCRMDTO);
        HistoriqueCRM historiqueCRM = historiqueCRMMapper.toEntity(historiqueCRMDTO);
        historiqueCRM = historiqueCRMRepository.save(historiqueCRM);
        return historiqueCRMMapper.toDto(historiqueCRM);
    }

    /**
     * Update a historiqueCRM.
     *
     * @param historiqueCRMDTO the entity to save.
     * @return the persisted entity.
     */
    public HistoriqueCRMDTO update(HistoriqueCRMDTO historiqueCRMDTO) {
        LOG.debug("Request to update HistoriqueCRM : {}", historiqueCRMDTO);
        HistoriqueCRM historiqueCRM = historiqueCRMMapper.toEntity(historiqueCRMDTO);
        historiqueCRM = historiqueCRMRepository.save(historiqueCRM);
        return historiqueCRMMapper.toDto(historiqueCRM);
    }

    /**
     * Partially update a historiqueCRM.
     *
     * @param historiqueCRMDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<HistoriqueCRMDTO> partialUpdate(HistoriqueCRMDTO historiqueCRMDTO) {
        LOG.debug("Request to partially update HistoriqueCRM : {}", historiqueCRMDTO);

        return historiqueCRMRepository
            .findById(historiqueCRMDTO.getId())
            .map(existingHistoriqueCRM -> {
                historiqueCRMMapper.partialUpdate(existingHistoriqueCRM, historiqueCRMDTO);

                return existingHistoriqueCRM;
            })
            .map(historiqueCRMRepository::save)
            .map(historiqueCRMMapper::toDto);
    }

    /**
     * Get all the historiqueCRMS.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<HistoriqueCRMDTO> findAll() {
        LOG.debug("Request to get all HistoriqueCRMS");
        return historiqueCRMRepository.findAll().stream().map(historiqueCRMMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one historiqueCRM by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<HistoriqueCRMDTO> findOne(Long id) {
        LOG.debug("Request to get HistoriqueCRM : {}", id);
        return historiqueCRMRepository.findById(id).map(historiqueCRMMapper::toDto);
    }

    /**
     * Delete the historiqueCRM by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete HistoriqueCRM : {}", id);
        historiqueCRMRepository.deleteById(id);
    }
}
