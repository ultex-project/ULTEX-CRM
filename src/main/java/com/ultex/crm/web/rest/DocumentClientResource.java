package com.ultex.crm.web.rest;

import com.ultex.crm.repository.DocumentClientRepository;
import com.ultex.crm.service.DocumentClientService;
import com.ultex.crm.service.dto.DocumentClientDTO;
import com.ultex.crm.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ultex.crm.domain.DocumentClient}.
 */
@RestController
@RequestMapping("/api/document-clients")
public class DocumentClientResource {

    private static final Logger LOG = LoggerFactory.getLogger(DocumentClientResource.class);

    private static final String ENTITY_NAME = "documentClient";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DocumentClientService documentClientService;

    private final DocumentClientRepository documentClientRepository;

    public DocumentClientResource(DocumentClientService documentClientService, DocumentClientRepository documentClientRepository) {
        this.documentClientService = documentClientService;
        this.documentClientRepository = documentClientRepository;
    }

    /**
     * {@code POST  /document-clients} : Create a new documentClient.
     *
     * @param documentClientDTO the documentClientDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new documentClientDTO, or with status {@code 400 (Bad Request)} if the documentClient has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<DocumentClientDTO> createDocumentClient(@Valid @RequestBody DocumentClientDTO documentClientDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save DocumentClient : {}", documentClientDTO);
        if (documentClientDTO.getId() != null) {
            throw new BadRequestAlertException("A new documentClient cannot already have an ID", ENTITY_NAME, "idexists");
        }
        documentClientDTO = documentClientService.save(documentClientDTO);
        return ResponseEntity.created(new URI("/api/document-clients/" + documentClientDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, documentClientDTO.getId().toString()))
            .body(documentClientDTO);
    }

    /**
     * {@code PUT  /document-clients/:id} : Updates an existing documentClient.
     *
     * @param id the id of the documentClientDTO to save.
     * @param documentClientDTO the documentClientDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documentClientDTO,
     * or with status {@code 400 (Bad Request)} if the documentClientDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the documentClientDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<DocumentClientDTO> updateDocumentClient(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DocumentClientDTO documentClientDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update DocumentClient : {}, {}", id, documentClientDTO);
        if (documentClientDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, documentClientDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!documentClientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        documentClientDTO = documentClientService.update(documentClientDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentClientDTO.getId().toString()))
            .body(documentClientDTO);
    }

    /**
     * {@code PATCH  /document-clients/:id} : Partial updates given fields of an existing documentClient, field will ignore if it is null
     *
     * @param id the id of the documentClientDTO to save.
     * @param documentClientDTO the documentClientDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documentClientDTO,
     * or with status {@code 400 (Bad Request)} if the documentClientDTO is not valid,
     * or with status {@code 404 (Not Found)} if the documentClientDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the documentClientDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DocumentClientDTO> partialUpdateDocumentClient(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DocumentClientDTO documentClientDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update DocumentClient partially : {}, {}", id, documentClientDTO);
        if (documentClientDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, documentClientDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!documentClientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DocumentClientDTO> result = documentClientService.partialUpdate(documentClientDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentClientDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /document-clients} : get all the documentClients.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documentClients in body.
     */
    @GetMapping("")
    public List<DocumentClientDTO> getAllDocumentClients() {
        LOG.debug("REST request to get all DocumentClients");
        return documentClientService.findAll();
    }

    /**
     * {@code GET  /document-clients/:id} : get the "id" documentClient.
     *
     * @param id the id of the documentClientDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the documentClientDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DocumentClientDTO> getDocumentClient(@PathVariable("id") Long id) {
        LOG.debug("REST request to get DocumentClient : {}", id);
        Optional<DocumentClientDTO> documentClientDTO = documentClientService.findOne(id);
        return ResponseUtil.wrapOrNotFound(documentClientDTO);
    }

    /**
     * {@code DELETE  /document-clients/:id} : delete the "id" documentClient.
     *
     * @param id the id of the documentClientDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocumentClient(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete DocumentClient : {}", id);
        documentClientService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
