package com.ultex.crm.web.rest;

import com.ultex.crm.repository.LangueRepository;
import com.ultex.crm.service.LangueService;
import com.ultex.crm.service.dto.LangueDTO;
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
 * REST controller for managing {@link com.ultex.crm.domain.Langue}.
 */
@RestController
@RequestMapping("/api/langues")
public class LangueResource {

    private static final Logger LOG = LoggerFactory.getLogger(LangueResource.class);

    private static final String ENTITY_NAME = "langue";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LangueService langueService;

    private final LangueRepository langueRepository;

    public LangueResource(LangueService langueService, LangueRepository langueRepository) {
        this.langueService = langueService;
        this.langueRepository = langueRepository;
    }

    /**
     * {@code POST  /langues} : Create a new langue.
     *
     * @param langueDTO the langueDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new langueDTO, or with status {@code 400 (Bad Request)} if the langue has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<LangueDTO> createLangue(@Valid @RequestBody LangueDTO langueDTO) throws URISyntaxException {
        LOG.debug("REST request to save Langue : {}", langueDTO);
        if (langueDTO.getId() != null) {
            throw new BadRequestAlertException("A new langue cannot already have an ID", ENTITY_NAME, "idexists");
        }
        langueDTO = langueService.save(langueDTO);
        return ResponseEntity.created(new URI("/api/langues/" + langueDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, langueDTO.getId().toString()))
            .body(langueDTO);
    }

    /**
     * {@code PUT  /langues/:id} : Updates an existing langue.
     *
     * @param id the id of the langueDTO to save.
     * @param langueDTO the langueDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated langueDTO,
     * or with status {@code 400 (Bad Request)} if the langueDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the langueDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<LangueDTO> updateLangue(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LangueDTO langueDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Langue : {}, {}", id, langueDTO);
        if (langueDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, langueDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!langueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        langueDTO = langueService.update(langueDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, langueDTO.getId().toString()))
            .body(langueDTO);
    }

    /**
     * {@code PATCH  /langues/:id} : Partial updates given fields of an existing langue, field will ignore if it is null
     *
     * @param id the id of the langueDTO to save.
     * @param langueDTO the langueDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated langueDTO,
     * or with status {@code 400 (Bad Request)} if the langueDTO is not valid,
     * or with status {@code 404 (Not Found)} if the langueDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the langueDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LangueDTO> partialUpdateLangue(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LangueDTO langueDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Langue partially : {}, {}", id, langueDTO);
        if (langueDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, langueDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!langueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LangueDTO> result = langueService.partialUpdate(langueDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, langueDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /langues} : get all the langues.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of langues in body.
     */
    @GetMapping("")
    public ResponseEntity<List<LangueDTO>> getAllLangues(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Langues");
        Page<LangueDTO> page = langueService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /langues/:id} : get the "id" langue.
     *
     * @param id the id of the langueDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the langueDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LangueDTO> getLangue(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Langue : {}", id);
        Optional<LangueDTO> langueDTO = langueService.findOne(id);
        return ResponseUtil.wrapOrNotFound(langueDTO);
    }

    /**
     * {@code DELETE  /langues/:id} : delete the "id" langue.
     *
     * @param id the id of the langueDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLangue(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Langue : {}", id);
        langueService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
