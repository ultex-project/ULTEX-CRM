package com.ultex.crm.web.rest;

import com.ultex.crm.repository.ProspectRepository;
import com.ultex.crm.service.ProspectService;
import com.ultex.crm.service.dto.ProspectDTO;
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
 * REST controller for managing {@link com.ultex.crm.domain.Prospect}.
 */
@RestController
@RequestMapping("/api/prospects")
public class ProspectResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProspectResource.class);

    private static final String ENTITY_NAME = "prospect";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProspectService prospectService;

    private final ProspectRepository prospectRepository;

    public ProspectResource(ProspectService prospectService, ProspectRepository prospectRepository) {
        this.prospectService = prospectService;
        this.prospectRepository = prospectRepository;
    }

    /**
     * {@code POST  /prospects} : Create a new prospect.
     *
     * @param prospectDTO the prospectDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new prospectDTO, or with status {@code 400 (Bad Request)} if the prospect has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ProspectDTO> createProspect(@Valid @RequestBody ProspectDTO prospectDTO) throws URISyntaxException {
        LOG.debug("REST request to save Prospect : {}", prospectDTO);
        if (prospectDTO.getId() != null) {
            throw new BadRequestAlertException("A new prospect cannot already have an ID", ENTITY_NAME, "idexists");
        }
        prospectDTO = prospectService.save(prospectDTO);
        return ResponseEntity.created(new URI("/api/prospects/" + prospectDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, prospectDTO.getId().toString()))
            .body(prospectDTO);
    }

    /**
     * {@code PUT  /prospects/:id} : Updates an existing prospect.
     *
     * @param id the id of the prospectDTO to save.
     * @param prospectDTO the prospectDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prospectDTO,
     * or with status {@code 400 (Bad Request)} if the prospectDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the prospectDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProspectDTO> updateProspect(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProspectDTO prospectDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Prospect : {}, {}", id, prospectDTO);
        if (prospectDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prospectDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!prospectRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        prospectDTO = prospectService.update(prospectDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prospectDTO.getId().toString()))
            .body(prospectDTO);
    }

    /**
     * {@code PATCH  /prospects/:id} : Partial updates given fields of an existing prospect, field will ignore if it is null
     *
     * @param id the id of the prospectDTO to save.
     * @param prospectDTO the prospectDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prospectDTO,
     * or with status {@code 400 (Bad Request)} if the prospectDTO is not valid,
     * or with status {@code 404 (Not Found)} if the prospectDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the prospectDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProspectDTO> partialUpdateProspect(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProspectDTO prospectDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Prospect partially : {}, {}", id, prospectDTO);
        if (prospectDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prospectDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!prospectRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProspectDTO> result = prospectService.partialUpdate(prospectDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prospectDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /prospects} : get all the prospects.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of prospects in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ProspectDTO>> getAllProspects(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Prospects");
        Page<ProspectDTO> page = prospectService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /prospects/:id} : get the "id" prospect.
     *
     * @param id the id of the prospectDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the prospectDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProspectDTO> getProspect(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Prospect : {}", id);
        Optional<ProspectDTO> prospectDTO = prospectService.findOne(id);
        return ResponseUtil.wrapOrNotFound(prospectDTO);
    }

    /**
     * {@code DELETE  /prospects/:id} : delete the "id" prospect.
     *
     * @param id the id of the prospectDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProspect(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Prospect : {}", id);
        prospectService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
