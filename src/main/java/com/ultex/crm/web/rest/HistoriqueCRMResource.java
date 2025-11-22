package com.ultex.crm.web.rest;

import com.ultex.crm.repository.HistoriqueCRMRepository;
import com.ultex.crm.service.HistoriqueCRMService;
import com.ultex.crm.service.dto.HistoriqueCRMDTO;
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
 * REST controller for managing {@link com.ultex.crm.domain.HistoriqueCRM}.
 */
@RestController
@RequestMapping("/api/historique-crms")
public class HistoriqueCRMResource {

    private static final Logger LOG = LoggerFactory.getLogger(HistoriqueCRMResource.class);

    private static final String ENTITY_NAME = "historiqueCRM";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HistoriqueCRMService historiqueCRMService;

    private final HistoriqueCRMRepository historiqueCRMRepository;

    public HistoriqueCRMResource(HistoriqueCRMService historiqueCRMService, HistoriqueCRMRepository historiqueCRMRepository) {
        this.historiqueCRMService = historiqueCRMService;
        this.historiqueCRMRepository = historiqueCRMRepository;
    }

    /**
     * {@code POST  /historique-crms} : Create a new historiqueCRM.
     *
     * @param historiqueCRMDTO the historiqueCRMDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new historiqueCRMDTO, or with status {@code 400 (Bad Request)} if the historiqueCRM has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<HistoriqueCRMDTO> createHistoriqueCRM(@Valid @RequestBody HistoriqueCRMDTO historiqueCRMDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save HistoriqueCRM : {}", historiqueCRMDTO);
        if (historiqueCRMDTO.getId() != null) {
            throw new BadRequestAlertException("A new historiqueCRM cannot already have an ID", ENTITY_NAME, "idexists");
        }
        historiqueCRMDTO = historiqueCRMService.save(historiqueCRMDTO);
        return ResponseEntity.created(new URI("/api/historique-crms/" + historiqueCRMDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, historiqueCRMDTO.getId().toString()))
            .body(historiqueCRMDTO);
    }

    /**
     * {@code PUT  /historique-crms/:id} : Updates an existing historiqueCRM.
     *
     * @param id the id of the historiqueCRMDTO to save.
     * @param historiqueCRMDTO the historiqueCRMDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated historiqueCRMDTO,
     * or with status {@code 400 (Bad Request)} if the historiqueCRMDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the historiqueCRMDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<HistoriqueCRMDTO> updateHistoriqueCRM(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody HistoriqueCRMDTO historiqueCRMDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update HistoriqueCRM : {}, {}", id, historiqueCRMDTO);
        if (historiqueCRMDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, historiqueCRMDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!historiqueCRMRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        historiqueCRMDTO = historiqueCRMService.update(historiqueCRMDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, historiqueCRMDTO.getId().toString()))
            .body(historiqueCRMDTO);
    }

    /**
     * {@code PATCH  /historique-crms/:id} : Partial updates given fields of an existing historiqueCRM, field will ignore if it is null
     *
     * @param id the id of the historiqueCRMDTO to save.
     * @param historiqueCRMDTO the historiqueCRMDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated historiqueCRMDTO,
     * or with status {@code 400 (Bad Request)} if the historiqueCRMDTO is not valid,
     * or with status {@code 404 (Not Found)} if the historiqueCRMDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the historiqueCRMDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HistoriqueCRMDTO> partialUpdateHistoriqueCRM(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody HistoriqueCRMDTO historiqueCRMDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update HistoriqueCRM partially : {}, {}", id, historiqueCRMDTO);
        if (historiqueCRMDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, historiqueCRMDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!historiqueCRMRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HistoriqueCRMDTO> result = historiqueCRMService.partialUpdate(historiqueCRMDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, historiqueCRMDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /historique-crms} : get all the historiqueCRMS.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of historiqueCRMS in body.
     */
    @GetMapping("")
    public ResponseEntity<List<HistoriqueCRMDTO>> getAllHistoriqueCRMS(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of HistoriqueCRMS");
        Page<HistoriqueCRMDTO> page = historiqueCRMService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /historique-crms/:id} : get the "id" historiqueCRM.
     *
     * @param id the id of the historiqueCRMDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the historiqueCRMDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<HistoriqueCRMDTO> getHistoriqueCRM(@PathVariable("id") Long id) {
        LOG.debug("REST request to get HistoriqueCRM : {}", id);
        Optional<HistoriqueCRMDTO> historiqueCRMDTO = historiqueCRMService.findOne(id);
        return ResponseUtil.wrapOrNotFound(historiqueCRMDTO);
    }

    /**
     * {@code DELETE  /historique-crms/:id} : delete the "id" historiqueCRM.
     *
     * @param id the id of the historiqueCRMDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistoriqueCRM(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete HistoriqueCRM : {}", id);
        historiqueCRMService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
