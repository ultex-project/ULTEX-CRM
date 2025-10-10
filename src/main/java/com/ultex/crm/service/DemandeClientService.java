package com.ultex.crm.service;

import com.ultex.crm.domain.DemandeClient;
import com.ultex.crm.repository.DemandeClientRepository;
import com.ultex.crm.service.dto.DemandeClientDTO;
import com.ultex.crm.service.mapper.DemandeClientMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.DemandeClient}.
 */
@Service
@Transactional
public class DemandeClientService {

    private static final Logger LOG = LoggerFactory.getLogger(DemandeClientService.class);

    private final DemandeClientRepository demandeClientRepository;

    private final DemandeClientMapper demandeClientMapper;

    public DemandeClientService(DemandeClientRepository demandeClientRepository, DemandeClientMapper demandeClientMapper) {
        this.demandeClientRepository = demandeClientRepository;
        this.demandeClientMapper = demandeClientMapper;
    }

    /**
     * Save a demandeClient.
     *
     * @param demandeClientDTO the entity to save.
     * @return the persisted entity.
     */
    public DemandeClientDTO save(DemandeClientDTO demandeClientDTO) {
        LOG.debug("Request to save DemandeClient : {}", demandeClientDTO);
        DemandeClient demandeClient = demandeClientMapper.toEntity(demandeClientDTO);
        demandeClient = demandeClientRepository.save(demandeClient);
        return demandeClientMapper.toDto(demandeClient);
    }

    /**
     * Update a demandeClient.
     *
     * @param demandeClientDTO the entity to save.
     * @return the persisted entity.
     */
    public DemandeClientDTO update(DemandeClientDTO demandeClientDTO) {
        LOG.debug("Request to update DemandeClient : {}", demandeClientDTO);
        DemandeClient demandeClient = demandeClientMapper.toEntity(demandeClientDTO);
        demandeClient = demandeClientRepository.save(demandeClient);
        return demandeClientMapper.toDto(demandeClient);
    }

    /**
     * Partially update a demandeClient.
     *
     * @param demandeClientDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<DemandeClientDTO> partialUpdate(DemandeClientDTO demandeClientDTO) {
        LOG.debug("Request to partially update DemandeClient : {}", demandeClientDTO);

        return demandeClientRepository
            .findById(demandeClientDTO.getId())
            .map(existingDemandeClient -> {
                demandeClientMapper.partialUpdate(existingDemandeClient, demandeClientDTO);

                return existingDemandeClient;
            })
            .map(demandeClientRepository::save)
            .map(demandeClientMapper::toDto);
    }

    /**
     * Get all the demandeClients.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<DemandeClientDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all DemandeClients");
        return demandeClientRepository.findAll(pageable).map(demandeClientMapper::toDto);
    }

    /**
     * Get one demandeClient by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<DemandeClientDTO> findOne(Long id) {
        LOG.debug("Request to get DemandeClient : {}", id);
        return demandeClientRepository.findById(id).map(demandeClientMapper::toDto);
    }

    /**
     * Delete the demandeClient by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete DemandeClient : {}", id);
        demandeClientRepository.deleteById(id);
    }
}
