package com.ultex.crm.web.rest;

import com.ultex.crm.repository.PaysRepository;
import com.ultex.crm.service.PaysService;
import com.ultex.crm.service.dto.PaysDTO;
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
 * REST controller for managing {@link com.ultex.crm.domain.Pays}.
 */
@RestController
@RequestMapping("/api/pays")
public class PaysResource {

    private static final Logger LOG = LoggerFactory.getLogger(PaysResource.class);

    private static final String ENTITY_NAME = "pays";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PaysService paysService;

    private final PaysRepository paysRepository;

    public PaysResource(PaysService paysService, PaysRepository paysRepository) {
        this.paysService = paysService;
        this.paysRepository = paysRepository;
    }

    /**
     * {@code POST  /pays} : Create a new pays.
     *
     * @param paysDTO the paysDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new paysDTO, or with status {@code 400 (Bad Request)} if the pays has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PaysDTO> createPays(@Valid @RequestBody PaysDTO paysDTO) throws URISyntaxException {
        LOG.debug("REST request to save Pays : {}", paysDTO);
        if (paysDTO.getId() != null) {
            throw new BadRequestAlertException("A new pays cannot already have an ID", ENTITY_NAME, "idexists");
        }
        paysDTO = paysService.save(paysDTO);
        return ResponseEntity.created(new URI("/api/pays/" + paysDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, paysDTO.getId().toString()))
            .body(paysDTO);
    }

    /**
     * {@code PUT  /pays/:id} : Updates an existing pays.
     *
     * @param id the id of the paysDTO to save.
     * @param paysDTO the paysDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated paysDTO,
     * or with status {@code 400 (Bad Request)} if the paysDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the paysDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PaysDTO> updatePays(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PaysDTO paysDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Pays : {}, {}", id, paysDTO);
        if (paysDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, paysDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!paysRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        paysDTO = paysService.update(paysDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, paysDTO.getId().toString()))
            .body(paysDTO);
    }

    /**
     * {@code PATCH  /pays/:id} : Partial updates given fields of an existing pays, field will ignore if it is null
     *
     * @param id the id of the paysDTO to save.
     * @param paysDTO the paysDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated paysDTO,
     * or with status {@code 400 (Bad Request)} if the paysDTO is not valid,
     * or with status {@code 404 (Not Found)} if the paysDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the paysDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PaysDTO> partialUpdatePays(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PaysDTO paysDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Pays partially : {}, {}", id, paysDTO);
        if (paysDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, paysDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!paysRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PaysDTO> result = paysService.partialUpdate(paysDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, paysDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /pays} : get all the pays.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pays in body.
     */
    @GetMapping("")
    public ResponseEntity<List<PaysDTO>> getAllPays(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Pays");
        Page<PaysDTO> page = paysService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /pays/:id} : get the "id" pays.
     *
     * @param id the id of the paysDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the paysDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PaysDTO> getPays(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Pays : {}", id);
        Optional<PaysDTO> paysDTO = paysService.findOne(id);
        return ResponseUtil.wrapOrNotFound(paysDTO);
    }

    /**
     * {@code DELETE  /pays/:id} : delete the "id" pays.
     *
     * @param id the id of the paysDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePays(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Pays : {}", id);
        paysService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
