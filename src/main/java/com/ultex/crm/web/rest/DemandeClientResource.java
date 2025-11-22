package com.ultex.crm.web.rest;

import com.ultex.crm.repository.DemandeClientRepository;
import com.ultex.crm.service.DemandeClientService;
import com.ultex.crm.service.dto.DemandeClientDTO;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ultex.crm.domain.DemandeClient}.
 */
@RestController
@RequestMapping("/api/demande-clients")
public class DemandeClientResource {

    private static final Logger LOG = LoggerFactory.getLogger(DemandeClientResource.class);

    private static final String ENTITY_NAME = "demandeClient";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DemandeClientService demandeClientService;

    private final DemandeClientRepository demandeClientRepository;

    public DemandeClientResource(DemandeClientService demandeClientService, DemandeClientRepository demandeClientRepository) {
        this.demandeClientService = demandeClientService;
        this.demandeClientRepository = demandeClientRepository;
    }

    /**
     * {@code POST  /demande-clients} : Create a new demandeClient.
     *
     * @param demandeClientDTO the demandeClientDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new demandeClientDTO, or with status {@code 400 (Bad Request)} if the demandeClient has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<DemandeClientDTO> createDemandeClient(@Valid @RequestBody DemandeClientDTO demandeClientDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save DemandeClient : {}", demandeClientDTO);
        if (demandeClientDTO.getId() != null) {
            throw new BadRequestAlertException("A new demandeClient cannot already have an ID", ENTITY_NAME, "idexists");
        }
        demandeClientDTO = demandeClientService.save(demandeClientDTO);
        return ResponseEntity.created(new URI("/api/demande-clients/" + demandeClientDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, demandeClientDTO.getId().toString()))
            .body(demandeClientDTO);
    }

    /**
     * {@code PUT  /demande-clients/:id} : Updates an existing demandeClient.
     *
     * @param id the id of the demandeClientDTO to save.
     * @param demandeClientDTO the demandeClientDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated demandeClientDTO,
     * or with status {@code 400 (Bad Request)} if the demandeClientDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the demandeClientDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<DemandeClientDTO> updateDemandeClient(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DemandeClientDTO demandeClientDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update DemandeClient : {}, {}", id, demandeClientDTO);
        if (demandeClientDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, demandeClientDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!demandeClientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        demandeClientDTO = demandeClientService.update(demandeClientDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, demandeClientDTO.getId().toString()))
            .body(demandeClientDTO);
    }

    /**
     * {@code PATCH  /demande-clients/:id} : Partial updates given fields of an existing demandeClient, field will ignore if it is null
     *
     * @param id the id of the demandeClientDTO to save.
     * @param demandeClientDTO the demandeClientDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated demandeClientDTO,
     * or with status {@code 400 (Bad Request)} if the demandeClientDTO is not valid,
     * or with status {@code 404 (Not Found)} if the demandeClientDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the demandeClientDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DemandeClientDTO> partialUpdateDemandeClient(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DemandeClientDTO demandeClientDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update DemandeClient partially : {}, {}", id, demandeClientDTO);
        if (demandeClientDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, demandeClientDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!demandeClientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DemandeClientDTO> result = demandeClientService.partialUpdate(demandeClientDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, demandeClientDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /demande-clients} : get all the demandeClients.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of demandeClients in body.
     */
    @GetMapping("")
    public ResponseEntity<List<DemandeClientDTO>> getAllDemandeClients(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of DemandeClients");
        Page<DemandeClientDTO> page;
        if (eagerload) {
            page = demandeClientService.findAllWithEagerRelationships(pageable);
        } else {
            page = demandeClientService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /demande-clients/:id} : get the "id" demandeClient.
     *
     * @param id the id of the demandeClientDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the demandeClientDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DemandeClientDTO> getDemandeClient(@PathVariable("id") Long id) {
        LOG.debug("REST request to get DemandeClient : {}", id);
        Optional<DemandeClientDTO> demandeClientDTO = demandeClientService.findOne(id);
        return ResponseUtil.wrapOrNotFound(demandeClientDTO);
    }

    /**
     * {@code DELETE  /demande-clients/:id} : delete the "id" demandeClient.
     *
     * @param id the id of the demandeClientDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDemandeClient(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete DemandeClient : {}", id);
        demandeClientService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
