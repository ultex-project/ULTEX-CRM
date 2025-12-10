package com.ultex.crm.web.rest;

import com.ultex.crm.repository.ReseauSocialRepository;
import com.ultex.crm.service.ReseauSocialService;
import com.ultex.crm.service.dto.ReseauSocialDTO;
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
 * REST controller for managing {@link com.ultex.crm.domain.ReseauSocial}.
 */
@RestController
@RequestMapping("/api/reseau-socials")
public class ReseauSocialResource {

    private static final Logger LOG = LoggerFactory.getLogger(ReseauSocialResource.class);

    private static final String ENTITY_NAME = "reseauSocial";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReseauSocialService reseauSocialService;

    private final ReseauSocialRepository reseauSocialRepository;

    public ReseauSocialResource(ReseauSocialService reseauSocialService, ReseauSocialRepository reseauSocialRepository) {
        this.reseauSocialService = reseauSocialService;
        this.reseauSocialRepository = reseauSocialRepository;
    }

    /**
     * {@code POST  /reseau-socials} : Create a new reseauSocial.
     *
     * @param reseauSocialDTO the reseauSocialDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reseauSocialDTO, or with status {@code 400 (Bad Request)} if the reseauSocial has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ReseauSocialDTO> createReseauSocial(@Valid @RequestBody ReseauSocialDTO reseauSocialDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ReseauSocial : {}", reseauSocialDTO);
        if (reseauSocialDTO.getId() != null) {
            throw new BadRequestAlertException("A new reseauSocial cannot already have an ID", ENTITY_NAME, "idexists");
        }
        reseauSocialDTO = reseauSocialService.save(reseauSocialDTO);
        return ResponseEntity.created(new URI("/api/reseau-socials/" + reseauSocialDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, reseauSocialDTO.getId().toString()))
            .body(reseauSocialDTO);
    }

    /**
     * {@code PUT  /reseau-socials/:id} : Updates an existing reseauSocial.
     *
     * @param id the id of the reseauSocialDTO to save.
     * @param reseauSocialDTO the reseauSocialDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reseauSocialDTO,
     * or with status {@code 400 (Bad Request)} if the reseauSocialDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reseauSocialDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReseauSocialDTO> updateReseauSocial(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ReseauSocialDTO reseauSocialDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ReseauSocial : {}, {}", id, reseauSocialDTO);
        if (reseauSocialDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reseauSocialDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reseauSocialRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        reseauSocialDTO = reseauSocialService.update(reseauSocialDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reseauSocialDTO.getId().toString()))
            .body(reseauSocialDTO);
    }

    /**
     * {@code PATCH  /reseau-socials/:id} : Partial updates given fields of an existing reseauSocial, field will ignore if it is null
     *
     * @param id the id of the reseauSocialDTO to save.
     * @param reseauSocialDTO the reseauSocialDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reseauSocialDTO,
     * or with status {@code 400 (Bad Request)} if the reseauSocialDTO is not valid,
     * or with status {@code 404 (Not Found)} if the reseauSocialDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the reseauSocialDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ReseauSocialDTO> partialUpdateReseauSocial(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ReseauSocialDTO reseauSocialDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ReseauSocial partially : {}, {}", id, reseauSocialDTO);
        if (reseauSocialDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reseauSocialDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reseauSocialRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReseauSocialDTO> result = reseauSocialService.partialUpdate(reseauSocialDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reseauSocialDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /reseau-socials} : get all the reseauSocials.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reseauSocials in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ReseauSocialDTO>> getAllReseauSocials(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of ReseauSocials");
        Page<ReseauSocialDTO> page = reseauSocialService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /reseau-socials/:id} : get the "id" reseauSocial.
     *
     * @param id the id of the reseauSocialDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reseauSocialDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReseauSocialDTO> getReseauSocial(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ReseauSocial : {}", id);
        Optional<ReseauSocialDTO> reseauSocialDTO = reseauSocialService.findOne(id);
        return ResponseUtil.wrapOrNotFound(reseauSocialDTO);
    }

    /**
     * {@code DELETE  /reseau-socials/:id} : delete the "id" reseauSocial.
     *
     * @param id the id of the reseauSocialDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReseauSocial(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ReseauSocial : {}", id);
        reseauSocialService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
