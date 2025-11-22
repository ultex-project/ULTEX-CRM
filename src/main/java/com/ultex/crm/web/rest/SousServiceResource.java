package com.ultex.crm.web.rest;

import com.ultex.crm.repository.SousServiceRepository;
import com.ultex.crm.service.SousServiceService;
import com.ultex.crm.service.dto.SousServiceDTO;
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
 * REST controller for managing {@link com.ultex.crm.domain.SousService}.
 */
@RestController
@RequestMapping("/api/sous-services")
public class SousServiceResource {

    private static final Logger LOG = LoggerFactory.getLogger(SousServiceResource.class);

    private static final String ENTITY_NAME = "sousService";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SousServiceService sousServiceService;

    private final SousServiceRepository sousServiceRepository;

    public SousServiceResource(SousServiceService sousServiceService, SousServiceRepository sousServiceRepository) {
        this.sousServiceService = sousServiceService;
        this.sousServiceRepository = sousServiceRepository;
    }

    /**
     * {@code POST  /sous-services} : Create a new sousService.
     *
     * @param sousServiceDTO the sousServiceDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sousServiceDTO, or with status {@code 400 (Bad Request)} if the sousService has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<SousServiceDTO> createSousService(@Valid @RequestBody SousServiceDTO sousServiceDTO) throws URISyntaxException {
        LOG.debug("REST request to save SousService : {}", sousServiceDTO);
        if (sousServiceDTO.getId() != null) {
            throw new BadRequestAlertException("A new sousService cannot already have an ID", ENTITY_NAME, "idexists");
        }
        sousServiceDTO = sousServiceService.save(sousServiceDTO);
        return ResponseEntity.created(new URI("/api/sous-services/" + sousServiceDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, sousServiceDTO.getId().toString()))
            .body(sousServiceDTO);
    }

    /**
     * {@code PUT  /sous-services/:id} : Updates an existing sousService.
     *
     * @param id the id of the sousServiceDTO to save.
     * @param sousServiceDTO the sousServiceDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sousServiceDTO,
     * or with status {@code 400 (Bad Request)} if the sousServiceDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sousServiceDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SousServiceDTO> updateSousService(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SousServiceDTO sousServiceDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update SousService : {}, {}", id, sousServiceDTO);
        if (sousServiceDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sousServiceDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sousServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        sousServiceDTO = sousServiceService.update(sousServiceDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sousServiceDTO.getId().toString()))
            .body(sousServiceDTO);
    }

    /**
     * {@code PATCH  /sous-services/:id} : Partial updates given fields of an existing sousService, field will ignore if it is null
     *
     * @param id the id of the sousServiceDTO to save.
     * @param sousServiceDTO the sousServiceDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sousServiceDTO,
     * or with status {@code 400 (Bad Request)} if the sousServiceDTO is not valid,
     * or with status {@code 404 (Not Found)} if the sousServiceDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the sousServiceDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SousServiceDTO> partialUpdateSousService(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SousServiceDTO sousServiceDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update SousService partially : {}, {}", id, sousServiceDTO);
        if (sousServiceDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sousServiceDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sousServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SousServiceDTO> result = sousServiceService.partialUpdate(sousServiceDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sousServiceDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /sous-services} : get all the sousServices.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sousServices in body.
     */
    @GetMapping("")
    public ResponseEntity<List<SousServiceDTO>> getAllSousServices(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of SousServices");
        Page<SousServiceDTO> page = sousServiceService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /sous-services/:id} : get the "id" sousService.
     *
     * @param id the id of the sousServiceDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sousServiceDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SousServiceDTO> getSousService(@PathVariable("id") Long id) {
        LOG.debug("REST request to get SousService : {}", id);
        Optional<SousServiceDTO> sousServiceDTO = sousServiceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(sousServiceDTO);
    }

    /**
     * {@code DELETE  /sous-services/:id} : delete the "id" sousService.
     *
     * @param id the id of the sousServiceDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSousService(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete SousService : {}", id);
        sousServiceService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
