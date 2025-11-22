package com.ultex.crm.web.rest;

import com.ultex.crm.repository.IncotermRepository;
import com.ultex.crm.service.IncotermService;
import com.ultex.crm.service.dto.IncotermDTO;
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
 * REST controller for managing {@link com.ultex.crm.domain.Incoterm}.
 */
@RestController
@RequestMapping("/api/incoterms")
public class IncotermResource {

    private static final Logger LOG = LoggerFactory.getLogger(IncotermResource.class);

    private static final String ENTITY_NAME = "incoterm";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IncotermService incotermService;

    private final IncotermRepository incotermRepository;

    public IncotermResource(IncotermService incotermService, IncotermRepository incotermRepository) {
        this.incotermService = incotermService;
        this.incotermRepository = incotermRepository;
    }

    /**
     * {@code POST  /incoterms} : Create a new incoterm.
     *
     * @param incotermDTO the incotermDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new incotermDTO, or with status {@code 400 (Bad Request)} if the incoterm has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<IncotermDTO> createIncoterm(@Valid @RequestBody IncotermDTO incotermDTO) throws URISyntaxException {
        LOG.debug("REST request to save Incoterm : {}", incotermDTO);
        if (incotermDTO.getId() != null) {
            throw new BadRequestAlertException("A new incoterm cannot already have an ID", ENTITY_NAME, "idexists");
        }
        incotermDTO = incotermService.save(incotermDTO);
        return ResponseEntity.created(new URI("/api/incoterms/" + incotermDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, incotermDTO.getId().toString()))
            .body(incotermDTO);
    }

    /**
     * {@code PUT  /incoterms/:id} : Updates an existing incoterm.
     *
     * @param id the id of the incotermDTO to save.
     * @param incotermDTO the incotermDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated incotermDTO,
     * or with status {@code 400 (Bad Request)} if the incotermDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the incotermDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<IncotermDTO> updateIncoterm(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody IncotermDTO incotermDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Incoterm : {}, {}", id, incotermDTO);
        if (incotermDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, incotermDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!incotermRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        incotermDTO = incotermService.update(incotermDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, incotermDTO.getId().toString()))
            .body(incotermDTO);
    }

    /**
     * {@code PATCH  /incoterms/:id} : Partial updates given fields of an existing incoterm, field will ignore if it is null
     *
     * @param id the id of the incotermDTO to save.
     * @param incotermDTO the incotermDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated incotermDTO,
     * or with status {@code 400 (Bad Request)} if the incotermDTO is not valid,
     * or with status {@code 404 (Not Found)} if the incotermDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the incotermDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<IncotermDTO> partialUpdateIncoterm(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody IncotermDTO incotermDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Incoterm partially : {}, {}", id, incotermDTO);
        if (incotermDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, incotermDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!incotermRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<IncotermDTO> result = incotermService.partialUpdate(incotermDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, incotermDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /incoterms} : get all the incoterms.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of incoterms in body.
     */
    @GetMapping("")
    public ResponseEntity<List<IncotermDTO>> getAllIncoterms(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Incoterms");
        Page<IncotermDTO> page = incotermService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /incoterms/:id} : get the "id" incoterm.
     *
     * @param id the id of the incotermDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the incotermDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<IncotermDTO> getIncoterm(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Incoterm : {}", id);
        Optional<IncotermDTO> incotermDTO = incotermService.findOne(id);
        return ResponseUtil.wrapOrNotFound(incotermDTO);
    }

    /**
     * {@code DELETE  /incoterms/:id} : delete the "id" incoterm.
     *
     * @param id the id of the incotermDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncoterm(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Incoterm : {}", id);
        incotermService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
