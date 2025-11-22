package com.ultex.crm.web.rest;

import com.ultex.crm.repository.CycleActivationRepository;
import com.ultex.crm.service.CycleActivationService;
import com.ultex.crm.service.dto.CycleActivationDTO;
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
 * REST controller for managing {@link com.ultex.crm.domain.CycleActivation}.
 */
@RestController
@RequestMapping("/api/cycle-activations")
public class CycleActivationResource {

    private static final Logger LOG = LoggerFactory.getLogger(CycleActivationResource.class);

    private static final String ENTITY_NAME = "cycleActivation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CycleActivationService cycleActivationService;

    private final CycleActivationRepository cycleActivationRepository;

    public CycleActivationResource(CycleActivationService cycleActivationService, CycleActivationRepository cycleActivationRepository) {
        this.cycleActivationService = cycleActivationService;
        this.cycleActivationRepository = cycleActivationRepository;
    }

    /**
     * {@code POST  /cycle-activations} : Create a new cycleActivation.
     *
     * @param cycleActivationDTO the cycleActivationDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cycleActivationDTO, or with status {@code 400 (Bad Request)} if the cycleActivation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CycleActivationDTO> createCycleActivation(@Valid @RequestBody CycleActivationDTO cycleActivationDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save CycleActivation : {}", cycleActivationDTO);
        if (cycleActivationDTO.getId() != null) {
            throw new BadRequestAlertException("A new cycleActivation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        cycleActivationDTO = cycleActivationService.save(cycleActivationDTO);
        return ResponseEntity.created(new URI("/api/cycle-activations/" + cycleActivationDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, cycleActivationDTO.getId().toString()))
            .body(cycleActivationDTO);
    }

    /**
     * {@code PUT  /cycle-activations/:id} : Updates an existing cycleActivation.
     *
     * @param id the id of the cycleActivationDTO to save.
     * @param cycleActivationDTO the cycleActivationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cycleActivationDTO,
     * or with status {@code 400 (Bad Request)} if the cycleActivationDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cycleActivationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CycleActivationDTO> updateCycleActivation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CycleActivationDTO cycleActivationDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update CycleActivation : {}, {}", id, cycleActivationDTO);
        if (cycleActivationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cycleActivationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cycleActivationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        cycleActivationDTO = cycleActivationService.update(cycleActivationDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cycleActivationDTO.getId().toString()))
            .body(cycleActivationDTO);
    }

    /**
     * {@code PATCH  /cycle-activations/:id} : Partial updates given fields of an existing cycleActivation, field will ignore if it is null
     *
     * @param id the id of the cycleActivationDTO to save.
     * @param cycleActivationDTO the cycleActivationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cycleActivationDTO,
     * or with status {@code 400 (Bad Request)} if the cycleActivationDTO is not valid,
     * or with status {@code 404 (Not Found)} if the cycleActivationDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the cycleActivationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CycleActivationDTO> partialUpdateCycleActivation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CycleActivationDTO cycleActivationDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update CycleActivation partially : {}, {}", id, cycleActivationDTO);
        if (cycleActivationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cycleActivationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cycleActivationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CycleActivationDTO> result = cycleActivationService.partialUpdate(cycleActivationDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cycleActivationDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /cycle-activations} : get all the cycleActivations.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cycleActivations in body.
     */
    @GetMapping("")
    public ResponseEntity<List<CycleActivationDTO>> getAllCycleActivations(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of CycleActivations");
        Page<CycleActivationDTO> page = cycleActivationService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /cycle-activations/:id} : get the "id" cycleActivation.
     *
     * @param id the id of the cycleActivationDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cycleActivationDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CycleActivationDTO> getCycleActivation(@PathVariable("id") Long id) {
        LOG.debug("REST request to get CycleActivation : {}", id);
        Optional<CycleActivationDTO> cycleActivationDTO = cycleActivationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(cycleActivationDTO);
    }

    /**
     * {@code DELETE  /cycle-activations/:id} : delete the "id" cycleActivation.
     *
     * @param id the id of the cycleActivationDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCycleActivation(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete CycleActivation : {}", id);
        cycleActivationService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
