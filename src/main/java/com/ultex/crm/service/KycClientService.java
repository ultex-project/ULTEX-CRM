package com.ultex.crm.service;

import com.ultex.crm.domain.KycClient;
import com.ultex.crm.repository.KycClientRepository;
import com.ultex.crm.service.dto.KycClientDTO;
import com.ultex.crm.service.mapper.KycClientMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.KycClient}.
 */
@Service
@Transactional
public class KycClientService {

    private static final Logger LOG = LoggerFactory.getLogger(KycClientService.class);

    private final KycClientRepository kycClientRepository;

    private final KycClientMapper kycClientMapper;

    public KycClientService(KycClientRepository kycClientRepository, KycClientMapper kycClientMapper) {
        this.kycClientRepository = kycClientRepository;
        this.kycClientMapper = kycClientMapper;
    }

    /**
     * Save a kycClient.
     *
     * @param kycClientDTO the entity to save.
     * @return the persisted entity.
     */
    public KycClientDTO save(KycClientDTO kycClientDTO) {
        LOG.debug("Request to save KycClient : {}", kycClientDTO);
        KycClient kycClient = kycClientMapper.toEntity(kycClientDTO);
        kycClient = kycClientRepository.save(kycClient);
        return kycClientMapper.toDto(kycClient);
    }

    /**
     * Update a kycClient.
     *
     * @param kycClientDTO the entity to save.
     * @return the persisted entity.
     */
    public KycClientDTO update(KycClientDTO kycClientDTO) {
        LOG.debug("Request to update KycClient : {}", kycClientDTO);
        KycClient kycClient = kycClientMapper.toEntity(kycClientDTO);
        kycClient = kycClientRepository.save(kycClient);
        return kycClientMapper.toDto(kycClient);
    }

    /**
     * Partially update a kycClient.
     *
     * @param kycClientDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<KycClientDTO> partialUpdate(KycClientDTO kycClientDTO) {
        LOG.debug("Request to partially update KycClient : {}", kycClientDTO);

        return kycClientRepository
            .findById(kycClientDTO.getId())
            .map(existingKycClient -> {
                kycClientMapper.partialUpdate(existingKycClient, kycClientDTO);

                return existingKycClient;
            })
            .map(kycClientRepository::save)
            .map(kycClientMapper::toDto);
    }

    /**
     * Get all the kycClients.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<KycClientDTO> findAll() {
        LOG.debug("Request to get all KycClients");
        return kycClientRepository.findAll().stream().map(kycClientMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one kycClient by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<KycClientDTO> findOne(Long id) {
        LOG.debug("Request to get KycClient : {}", id);
        return kycClientRepository.findById(id).map(kycClientMapper::toDto);
    }

    /**
     * Delete the kycClient by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete KycClient : {}", id);
        kycClientRepository.deleteById(id);
    }
}
