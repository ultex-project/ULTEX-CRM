package com.ultex.crm.web.rest;

import com.ultex.crm.repository.KycClientRepository;
import com.ultex.crm.service.KycClientService;
import com.ultex.crm.service.dto.KycClientDTO;
import com.ultex.crm.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.ultex.crm.domain.KycClient}.
 */
@RestController
@RequestMapping("/api/kyc-clients")
public class KycClientResource {

    private static final Logger LOG = LoggerFactory.getLogger(KycClientResource.class);

    private static final String ENTITY_NAME = "kycClient";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KycClientService kycClientService;

    private final KycClientRepository kycClientRepository;

    public KycClientResource(KycClientService kycClientService, KycClientRepository kycClientRepository) {
        this.kycClientService = kycClientService;
        this.kycClientRepository = kycClientRepository;
    }

    /**
     * {@code POST  /kyc-clients} : Create a new kycClient.
     *
     * @param kycClientDTO the kycClientDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new kycClientDTO, or with status {@code 400 (Bad Request)} if the kycClient has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<KycClientDTO> createKycClient(@RequestBody KycClientDTO kycClientDTO) throws URISyntaxException {
        LOG.debug("REST request to save KycClient : {}", kycClientDTO);
        if (kycClientDTO.getId() != null) {
            throw new BadRequestAlertException("A new kycClient cannot already have an ID", ENTITY_NAME, "idexists");
        }
        kycClientDTO = kycClientService.save(kycClientDTO);
        return ResponseEntity.created(new URI("/api/kyc-clients/" + kycClientDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, kycClientDTO.getId().toString()))
            .body(kycClientDTO);
    }

    /**
     * {@code PUT  /kyc-clients/:id} : Updates an existing kycClient.
     *
     * @param id the id of the kycClientDTO to save.
     * @param kycClientDTO the kycClientDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kycClientDTO,
     * or with status {@code 400 (Bad Request)} if the kycClientDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the kycClientDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<KycClientDTO> updateKycClient(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody KycClientDTO kycClientDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update KycClient : {}, {}", id, kycClientDTO);
        if (kycClientDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kycClientDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!kycClientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        kycClientDTO = kycClientService.update(kycClientDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, kycClientDTO.getId().toString()))
            .body(kycClientDTO);
    }

    /**
     * {@code PATCH  /kyc-clients/:id} : Partial updates given fields of an existing kycClient, field will ignore if it is null
     *
     * @param id the id of the kycClientDTO to save.
     * @param kycClientDTO the kycClientDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kycClientDTO,
     * or with status {@code 400 (Bad Request)} if the kycClientDTO is not valid,
     * or with status {@code 404 (Not Found)} if the kycClientDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the kycClientDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<KycClientDTO> partialUpdateKycClient(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody KycClientDTO kycClientDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update KycClient partially : {}, {}", id, kycClientDTO);
        if (kycClientDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kycClientDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!kycClientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<KycClientDTO> result = kycClientService.partialUpdate(kycClientDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, kycClientDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /kyc-clients} : get all the kycClients.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of kycClients in body.
     */
    @GetMapping("")
    public ResponseEntity<List<KycClientDTO>> getAllKycClients(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of KycClients");
        Page<KycClientDTO> page = kycClientService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /kyc-clients/:id} : get the "id" kycClient.
     *
     * @param id the id of the kycClientDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the kycClientDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<KycClientDTO> getKycClient(@PathVariable("id") Long id) {
        LOG.debug("REST request to get KycClient : {}", id);
        Optional<KycClientDTO> kycClientDTO = kycClientService.findOne(id);
        return ResponseUtil.wrapOrNotFound(kycClientDTO);
    }

    /**
     * {@code DELETE  /kyc-clients/:id} : delete the "id" kycClient.
     *
     * @param id the id of the kycClientDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKycClient(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete KycClient : {}", id);
        kycClientService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
