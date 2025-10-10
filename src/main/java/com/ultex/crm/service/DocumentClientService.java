package com.ultex.crm.service;

import com.ultex.crm.domain.DocumentClient;
import com.ultex.crm.repository.DocumentClientRepository;
import com.ultex.crm.service.dto.DocumentClientDTO;
import com.ultex.crm.service.mapper.DocumentClientMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.DocumentClient}.
 */
@Service
@Transactional
public class DocumentClientService {

    private static final Logger LOG = LoggerFactory.getLogger(DocumentClientService.class);

    private final DocumentClientRepository documentClientRepository;

    private final DocumentClientMapper documentClientMapper;

    public DocumentClientService(DocumentClientRepository documentClientRepository, DocumentClientMapper documentClientMapper) {
        this.documentClientRepository = documentClientRepository;
        this.documentClientMapper = documentClientMapper;
    }

    /**
     * Save a documentClient.
     *
     * @param documentClientDTO the entity to save.
     * @return the persisted entity.
     */
    public DocumentClientDTO save(DocumentClientDTO documentClientDTO) {
        LOG.debug("Request to save DocumentClient : {}", documentClientDTO);
        DocumentClient documentClient = documentClientMapper.toEntity(documentClientDTO);
        documentClient = documentClientRepository.save(documentClient);
        return documentClientMapper.toDto(documentClient);
    }

    /**
     * Update a documentClient.
     *
     * @param documentClientDTO the entity to save.
     * @return the persisted entity.
     */
    public DocumentClientDTO update(DocumentClientDTO documentClientDTO) {
        LOG.debug("Request to update DocumentClient : {}", documentClientDTO);
        DocumentClient documentClient = documentClientMapper.toEntity(documentClientDTO);
        documentClient = documentClientRepository.save(documentClient);
        return documentClientMapper.toDto(documentClient);
    }

    /**
     * Partially update a documentClient.
     *
     * @param documentClientDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<DocumentClientDTO> partialUpdate(DocumentClientDTO documentClientDTO) {
        LOG.debug("Request to partially update DocumentClient : {}", documentClientDTO);

        return documentClientRepository
            .findById(documentClientDTO.getId())
            .map(existingDocumentClient -> {
                documentClientMapper.partialUpdate(existingDocumentClient, documentClientDTO);

                return existingDocumentClient;
            })
            .map(documentClientRepository::save)
            .map(documentClientMapper::toDto);
    }

    /**
     * Get all the documentClients.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<DocumentClientDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all DocumentClients");
        return documentClientRepository.findAll(pageable).map(documentClientMapper::toDto);
    }

    /**
     * Get one documentClient by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<DocumentClientDTO> findOne(Long id) {
        LOG.debug("Request to get DocumentClient : {}", id);
        return documentClientRepository.findById(id).map(documentClientMapper::toDto);
    }

    /**
     * Delete the documentClient by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete DocumentClient : {}", id);
        documentClientRepository.deleteById(id);
    }
}
