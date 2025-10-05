package com.ultex.crm.web.rest;

import com.ultex.crm.repository.ContactAssocieRepository;
import com.ultex.crm.service.ContactAssocieService;
import com.ultex.crm.service.dto.ContactAssocieDTO;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ultex.crm.domain.ContactAssocie}.
 */
@RestController
@RequestMapping("/api/contact-associes")
public class ContactAssocieResource {

    private static final Logger LOG = LoggerFactory.getLogger(ContactAssocieResource.class);

    private static final String ENTITY_NAME = "contactAssocie";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContactAssocieService contactAssocieService;

    private final ContactAssocieRepository contactAssocieRepository;

    public ContactAssocieResource(ContactAssocieService contactAssocieService, ContactAssocieRepository contactAssocieRepository) {
        this.contactAssocieService = contactAssocieService;
        this.contactAssocieRepository = contactAssocieRepository;
    }

    /**
     * {@code POST  /contact-associes} : Create a new contactAssocie.
     *
     * @param contactAssocieDTO the contactAssocieDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new contactAssocieDTO, or with status {@code 400 (Bad Request)} if the contactAssocie has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ContactAssocieDTO> createContactAssocie(@Valid @RequestBody ContactAssocieDTO contactAssocieDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ContactAssocie : {}", contactAssocieDTO);
        if (contactAssocieDTO.getId() != null) {
            throw new BadRequestAlertException("A new contactAssocie cannot already have an ID", ENTITY_NAME, "idexists");
        }
        contactAssocieDTO = contactAssocieService.save(contactAssocieDTO);
        return ResponseEntity.created(new URI("/api/contact-associes/" + contactAssocieDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, contactAssocieDTO.getId().toString()))
            .body(contactAssocieDTO);
    }

    /**
     * {@code PUT  /contact-associes/:id} : Updates an existing contactAssocie.
     *
     * @param id the id of the contactAssocieDTO to save.
     * @param contactAssocieDTO the contactAssocieDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contactAssocieDTO,
     * or with status {@code 400 (Bad Request)} if the contactAssocieDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the contactAssocieDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ContactAssocieDTO> updateContactAssocie(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ContactAssocieDTO contactAssocieDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ContactAssocie : {}, {}", id, contactAssocieDTO);
        if (contactAssocieDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contactAssocieDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contactAssocieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        contactAssocieDTO = contactAssocieService.update(contactAssocieDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contactAssocieDTO.getId().toString()))
            .body(contactAssocieDTO);
    }

    /**
     * {@code PATCH  /contact-associes/:id} : Partial updates given fields of an existing contactAssocie, field will ignore if it is null
     *
     * @param id the id of the contactAssocieDTO to save.
     * @param contactAssocieDTO the contactAssocieDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contactAssocieDTO,
     * or with status {@code 400 (Bad Request)} if the contactAssocieDTO is not valid,
     * or with status {@code 404 (Not Found)} if the contactAssocieDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the contactAssocieDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ContactAssocieDTO> partialUpdateContactAssocie(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ContactAssocieDTO contactAssocieDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ContactAssocie partially : {}, {}", id, contactAssocieDTO);
        if (contactAssocieDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contactAssocieDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contactAssocieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ContactAssocieDTO> result = contactAssocieService.partialUpdate(contactAssocieDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contactAssocieDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /contact-associes} : get all the contactAssocies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contactAssocies in body.
     */
    @GetMapping("")
    public List<ContactAssocieDTO> getAllContactAssocies() {
        LOG.debug("REST request to get all ContactAssocies");
        return contactAssocieService.findAll();
    }

    /**
     * {@code GET  /contact-associes/:id} : get the "id" contactAssocie.
     *
     * @param id the id of the contactAssocieDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the contactAssocieDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ContactAssocieDTO> getContactAssocie(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ContactAssocie : {}", id);
        Optional<ContactAssocieDTO> contactAssocieDTO = contactAssocieService.findOne(id);
        return ResponseUtil.wrapOrNotFound(contactAssocieDTO);
    }

    /**
     * {@code DELETE  /contact-associes/:id} : delete the "id" contactAssocie.
     *
     * @param id the id of the contactAssocieDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContactAssocie(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ContactAssocie : {}", id);
        contactAssocieService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
