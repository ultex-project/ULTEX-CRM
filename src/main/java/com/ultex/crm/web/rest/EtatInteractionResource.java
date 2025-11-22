package com.ultex.crm.web.rest;

import com.ultex.crm.repository.EtatInteractionRepository;
import com.ultex.crm.service.EtatInteractionService;
import com.ultex.crm.service.dto.EtatInteractionDTO;
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
 * REST controller for managing {@link com.ultex.crm.domain.EtatInteraction}.
 */
@RestController
@RequestMapping("/api/etat-interactions")
public class EtatInteractionResource {

    private static final Logger LOG = LoggerFactory.getLogger(EtatInteractionResource.class);

    private static final String ENTITY_NAME = "etatInteraction";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EtatInteractionService etatInteractionService;

    private final EtatInteractionRepository etatInteractionRepository;

    public EtatInteractionResource(EtatInteractionService etatInteractionService, EtatInteractionRepository etatInteractionRepository) {
        this.etatInteractionService = etatInteractionService;
        this.etatInteractionRepository = etatInteractionRepository;
    }

    /**
     * {@code POST  /etat-interactions} : Create a new etatInteraction.
     *
     * @param etatInteractionDTO the etatInteractionDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new etatInteractionDTO, or with status {@code 400 (Bad Request)} if the etatInteraction has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<EtatInteractionDTO> createEtatInteraction(@Valid @RequestBody EtatInteractionDTO etatInteractionDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save EtatInteraction : {}", etatInteractionDTO);
        if (etatInteractionDTO.getId() != null) {
            throw new BadRequestAlertException("A new etatInteraction cannot already have an ID", ENTITY_NAME, "idexists");
        }
        etatInteractionDTO = etatInteractionService.save(etatInteractionDTO);
        return ResponseEntity.created(new URI("/api/etat-interactions/" + etatInteractionDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, etatInteractionDTO.getId().toString()))
            .body(etatInteractionDTO);
    }

    /**
     * {@code PUT  /etat-interactions/:id} : Updates an existing etatInteraction.
     *
     * @param id the id of the etatInteractionDTO to save.
     * @param etatInteractionDTO the etatInteractionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etatInteractionDTO,
     * or with status {@code 400 (Bad Request)} if the etatInteractionDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the etatInteractionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EtatInteractionDTO> updateEtatInteraction(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EtatInteractionDTO etatInteractionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update EtatInteraction : {}, {}", id, etatInteractionDTO);
        if (etatInteractionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etatInteractionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etatInteractionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        etatInteractionDTO = etatInteractionService.update(etatInteractionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, etatInteractionDTO.getId().toString()))
            .body(etatInteractionDTO);
    }

    /**
     * {@code PATCH  /etat-interactions/:id} : Partial updates given fields of an existing etatInteraction, field will ignore if it is null
     *
     * @param id the id of the etatInteractionDTO to save.
     * @param etatInteractionDTO the etatInteractionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etatInteractionDTO,
     * or with status {@code 400 (Bad Request)} if the etatInteractionDTO is not valid,
     * or with status {@code 404 (Not Found)} if the etatInteractionDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the etatInteractionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EtatInteractionDTO> partialUpdateEtatInteraction(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EtatInteractionDTO etatInteractionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update EtatInteraction partially : {}, {}", id, etatInteractionDTO);
        if (etatInteractionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etatInteractionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etatInteractionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EtatInteractionDTO> result = etatInteractionService.partialUpdate(etatInteractionDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, etatInteractionDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /etat-interactions} : get all the etatInteractions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of etatInteractions in body.
     */
    @GetMapping("")
    public ResponseEntity<List<EtatInteractionDTO>> getAllEtatInteractions(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of EtatInteractions");
        Page<EtatInteractionDTO> page = etatInteractionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /etat-interactions/:id} : get the "id" etatInteraction.
     *
     * @param id the id of the etatInteractionDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the etatInteractionDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EtatInteractionDTO> getEtatInteraction(@PathVariable("id") Long id) {
        LOG.debug("REST request to get EtatInteraction : {}", id);
        Optional<EtatInteractionDTO> etatInteractionDTO = etatInteractionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(etatInteractionDTO);
    }

    /**
     * {@code DELETE  /etat-interactions/:id} : delete the "id" etatInteraction.
     *
     * @param id the id of the etatInteractionDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtatInteraction(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete EtatInteraction : {}", id);
        etatInteractionService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
