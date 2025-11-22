package com.ultex.crm.web.rest;

import com.ultex.crm.repository.InternalUserRepository;
import com.ultex.crm.service.InternalUserService;
import com.ultex.crm.service.dto.InternalUserDTO;
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
 * REST controller for managing {@link com.ultex.crm.domain.InternalUser}.
 */
@RestController
@RequestMapping("/api/internal-users")
public class InternalUserResource {

    private static final Logger LOG = LoggerFactory.getLogger(InternalUserResource.class);

    private static final String ENTITY_NAME = "internalUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InternalUserService internalUserService;

    private final InternalUserRepository internalUserRepository;

    public InternalUserResource(InternalUserService internalUserService, InternalUserRepository internalUserRepository) {
        this.internalUserService = internalUserService;
        this.internalUserRepository = internalUserRepository;
    }

    /**
     * {@code POST  /internal-users} : Create a new internalUser.
     *
     * @param internalUserDTO the internalUserDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new internalUserDTO, or with status {@code 400 (Bad Request)} if the internalUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<InternalUserDTO> createInternalUser(@Valid @RequestBody InternalUserDTO internalUserDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save InternalUser : {}", internalUserDTO);
        if (internalUserDTO.getId() != null) {
            throw new BadRequestAlertException("A new internalUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        internalUserDTO = internalUserService.save(internalUserDTO);
        return ResponseEntity.created(new URI("/api/internal-users/" + internalUserDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, internalUserDTO.getId().toString()))
            .body(internalUserDTO);
    }

    /**
     * {@code PUT  /internal-users/:id} : Updates an existing internalUser.
     *
     * @param id the id of the internalUserDTO to save.
     * @param internalUserDTO the internalUserDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated internalUserDTO,
     * or with status {@code 400 (Bad Request)} if the internalUserDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the internalUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<InternalUserDTO> updateInternalUser(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody InternalUserDTO internalUserDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update InternalUser : {}, {}", id, internalUserDTO);
        if (internalUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, internalUserDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!internalUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        internalUserDTO = internalUserService.update(internalUserDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, internalUserDTO.getId().toString()))
            .body(internalUserDTO);
    }

    /**
     * {@code PATCH  /internal-users/:id} : Partial updates given fields of an existing internalUser, field will ignore if it is null
     *
     * @param id the id of the internalUserDTO to save.
     * @param internalUserDTO the internalUserDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated internalUserDTO,
     * or with status {@code 400 (Bad Request)} if the internalUserDTO is not valid,
     * or with status {@code 404 (Not Found)} if the internalUserDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the internalUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<InternalUserDTO> partialUpdateInternalUser(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody InternalUserDTO internalUserDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update InternalUser partially : {}, {}", id, internalUserDTO);
        if (internalUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, internalUserDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!internalUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<InternalUserDTO> result = internalUserService.partialUpdate(internalUserDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, internalUserDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /internal-users} : get all the internalUsers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of internalUsers in body.
     */
    @GetMapping("")
    public ResponseEntity<List<InternalUserDTO>> getAllInternalUsers(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of InternalUsers");
        Page<InternalUserDTO> page = internalUserService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /internal-users/:id} : get the "id" internalUser.
     *
     * @param id the id of the internalUserDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the internalUserDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<InternalUserDTO> getInternalUser(@PathVariable("id") Long id) {
        LOG.debug("REST request to get InternalUser : {}", id);
        Optional<InternalUserDTO> internalUserDTO = internalUserService.findOne(id);
        return ResponseUtil.wrapOrNotFound(internalUserDTO);
    }

    /**
     * {@code DELETE  /internal-users/:id} : delete the "id" internalUser.
     *
     * @param id the id of the internalUserDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInternalUser(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete InternalUser : {}", id);
        internalUserService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
