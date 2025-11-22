package com.ultex.crm.web.rest;

import com.ultex.crm.repository.SocieteLieeRepository;
import com.ultex.crm.service.SocieteLieeService;
import com.ultex.crm.service.dto.SocieteLieeDTO;
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
 * REST controller for managing {@link com.ultex.crm.domain.SocieteLiee}.
 */
@RestController
@RequestMapping("/api/societe-liees")
public class SocieteLieeResource {

    private static final Logger LOG = LoggerFactory.getLogger(SocieteLieeResource.class);

    private static final String ENTITY_NAME = "societeLiee";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SocieteLieeService societeLieeService;

    private final SocieteLieeRepository societeLieeRepository;

    public SocieteLieeResource(SocieteLieeService societeLieeService, SocieteLieeRepository societeLieeRepository) {
        this.societeLieeService = societeLieeService;
        this.societeLieeRepository = societeLieeRepository;
    }

    /**
     * {@code POST  /societe-liees} : Create a new societeLiee.
     *
     * @param societeLieeDTO the societeLieeDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new societeLieeDTO, or with status {@code 400 (Bad Request)} if the societeLiee has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<SocieteLieeDTO> createSocieteLiee(@Valid @RequestBody SocieteLieeDTO societeLieeDTO) throws URISyntaxException {
        LOG.debug("REST request to save SocieteLiee : {}", societeLieeDTO);
        if (societeLieeDTO.getId() != null) {
            throw new BadRequestAlertException("A new societeLiee cannot already have an ID", ENTITY_NAME, "idexists");
        }
        societeLieeDTO = societeLieeService.save(societeLieeDTO);
        return ResponseEntity.created(new URI("/api/societe-liees/" + societeLieeDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, societeLieeDTO.getId().toString()))
            .body(societeLieeDTO);
    }

    /**
     * {@code PUT  /societe-liees/:id} : Updates an existing societeLiee.
     *
     * @param id the id of the societeLieeDTO to save.
     * @param societeLieeDTO the societeLieeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated societeLieeDTO,
     * or with status {@code 400 (Bad Request)} if the societeLieeDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the societeLieeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SocieteLieeDTO> updateSocieteLiee(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SocieteLieeDTO societeLieeDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update SocieteLiee : {}, {}", id, societeLieeDTO);
        if (societeLieeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, societeLieeDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!societeLieeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        societeLieeDTO = societeLieeService.update(societeLieeDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, societeLieeDTO.getId().toString()))
            .body(societeLieeDTO);
    }

    /**
     * {@code PATCH  /societe-liees/:id} : Partial updates given fields of an existing societeLiee, field will ignore if it is null
     *
     * @param id the id of the societeLieeDTO to save.
     * @param societeLieeDTO the societeLieeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated societeLieeDTO,
     * or with status {@code 400 (Bad Request)} if the societeLieeDTO is not valid,
     * or with status {@code 404 (Not Found)} if the societeLieeDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the societeLieeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SocieteLieeDTO> partialUpdateSocieteLiee(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SocieteLieeDTO societeLieeDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update SocieteLiee partially : {}, {}", id, societeLieeDTO);
        if (societeLieeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, societeLieeDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!societeLieeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SocieteLieeDTO> result = societeLieeService.partialUpdate(societeLieeDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, societeLieeDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /societe-liees} : get all the societeLiees.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of societeLiees in body.
     */
    @GetMapping("")
    public ResponseEntity<List<SocieteLieeDTO>> getAllSocieteLiees(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of SocieteLiees");
        Page<SocieteLieeDTO> page = societeLieeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /societe-liees/:id} : get the "id" societeLiee.
     *
     * @param id the id of the societeLieeDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the societeLieeDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SocieteLieeDTO> getSocieteLiee(@PathVariable("id") Long id) {
        LOG.debug("REST request to get SocieteLiee : {}", id);
        Optional<SocieteLieeDTO> societeLieeDTO = societeLieeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(societeLieeDTO);
    }

    /**
     * {@code DELETE  /societe-liees/:id} : delete the "id" societeLiee.
     *
     * @param id the id of the societeLieeDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSocieteLiee(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete SocieteLiee : {}", id);
        societeLieeService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
