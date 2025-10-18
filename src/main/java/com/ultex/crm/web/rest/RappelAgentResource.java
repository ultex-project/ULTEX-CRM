package com.ultex.crm.web.rest;

import com.ultex.crm.repository.RappelAgentRepository;
import com.ultex.crm.service.RappelAgentService;
import com.ultex.crm.service.dto.RappelAgentDTO;
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
 * REST controller for managing {@link com.ultex.crm.domain.RappelAgent}.
 */
@RestController
@RequestMapping("/api/rappel-agents")
public class RappelAgentResource {

    private static final Logger LOG = LoggerFactory.getLogger(RappelAgentResource.class);

    private static final String ENTITY_NAME = "rappelAgent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RappelAgentService rappelAgentService;

    private final RappelAgentRepository rappelAgentRepository;

    public RappelAgentResource(RappelAgentService rappelAgentService, RappelAgentRepository rappelAgentRepository) {
        this.rappelAgentService = rappelAgentService;
        this.rappelAgentRepository = rappelAgentRepository;
    }

    /**
     * {@code POST  /rappel-agents} : Create a new rappelAgent.
     *
     * @param rappelAgentDTO the rappelAgentDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rappelAgentDTO, or with status {@code 400 (Bad Request)} if the rappelAgent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<RappelAgentDTO> createRappelAgent(@Valid @RequestBody RappelAgentDTO rappelAgentDTO) throws URISyntaxException {
        LOG.debug("REST request to save RappelAgent : {}", rappelAgentDTO);
        if (rappelAgentDTO.getId() != null) {
            throw new BadRequestAlertException("A new rappelAgent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        rappelAgentDTO = rappelAgentService.save(rappelAgentDTO);
        return ResponseEntity.created(new URI("/api/rappel-agents/" + rappelAgentDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, rappelAgentDTO.getId().toString()))
            .body(rappelAgentDTO);
    }

    /**
     * {@code PUT  /rappel-agents/:id} : Updates an existing rappelAgent.
     *
     * @param id the id of the rappelAgentDTO to save.
     * @param rappelAgentDTO the rappelAgentDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rappelAgentDTO,
     * or with status {@code 400 (Bad Request)} if the rappelAgentDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rappelAgentDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<RappelAgentDTO> updateRappelAgent(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody RappelAgentDTO rappelAgentDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update RappelAgent : {}, {}", id, rappelAgentDTO);
        if (rappelAgentDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rappelAgentDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rappelAgentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        rappelAgentDTO = rappelAgentService.update(rappelAgentDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rappelAgentDTO.getId().toString()))
            .body(rappelAgentDTO);
    }

    /**
     * {@code PATCH  /rappel-agents/:id} : Partial updates given fields of an existing rappelAgent, field will ignore if it is null
     *
     * @param id the id of the rappelAgentDTO to save.
     * @param rappelAgentDTO the rappelAgentDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rappelAgentDTO,
     * or with status {@code 400 (Bad Request)} if the rappelAgentDTO is not valid,
     * or with status {@code 404 (Not Found)} if the rappelAgentDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the rappelAgentDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RappelAgentDTO> partialUpdateRappelAgent(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody RappelAgentDTO rappelAgentDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update RappelAgent partially : {}, {}", id, rappelAgentDTO);
        if (rappelAgentDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rappelAgentDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rappelAgentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RappelAgentDTO> result = rappelAgentService.partialUpdate(rappelAgentDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rappelAgentDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /rappel-agents} : get all the rappelAgents.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rappelAgents in body.
     */
    @GetMapping("")
    public ResponseEntity<List<RappelAgentDTO>> getAllRappelAgents(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of RappelAgents");
        Page<RappelAgentDTO> page = rappelAgentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /rappel-agents/:id} : get the "id" rappelAgent.
     *
     * @param id the id of the rappelAgentDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rappelAgentDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RappelAgentDTO> getRappelAgent(@PathVariable("id") Long id) {
        LOG.debug("REST request to get RappelAgent : {}", id);
        Optional<RappelAgentDTO> rappelAgentDTO = rappelAgentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(rappelAgentDTO);
    }

    /**
     * {@code DELETE  /rappel-agents/:id} : delete the "id" rappelAgent.
     *
     * @param id the id of the rappelAgentDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRappelAgent(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete RappelAgent : {}", id);
        rappelAgentService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
