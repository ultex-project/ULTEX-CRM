package com.ultex.crm.web.rest;

import com.ultex.crm.repository.ProduitDemandeRepository;
import com.ultex.crm.service.ProduitDemandeService;
import com.ultex.crm.service.dto.ProduitDemandeDTO;
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
 * REST controller for managing {@link com.ultex.crm.domain.ProduitDemande}.
 */
@RestController
@RequestMapping("/api/produit-demandes")
public class ProduitDemandeResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProduitDemandeResource.class);

    private static final String ENTITY_NAME = "produitDemande";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProduitDemandeService produitDemandeService;

    private final ProduitDemandeRepository produitDemandeRepository;

    public ProduitDemandeResource(ProduitDemandeService produitDemandeService, ProduitDemandeRepository produitDemandeRepository) {
        this.produitDemandeService = produitDemandeService;
        this.produitDemandeRepository = produitDemandeRepository;
    }

    /**
     * {@code POST  /produit-demandes} : Create a new produitDemande.
     *
     * @param produitDemandeDTO the produitDemandeDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new produitDemandeDTO, or with status {@code 400 (Bad Request)} if the produitDemande has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ProduitDemandeDTO> createProduitDemande(@RequestBody ProduitDemandeDTO produitDemandeDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ProduitDemande : {}", produitDemandeDTO);
        if (produitDemandeDTO.getId() != null) {
            throw new BadRequestAlertException("A new produitDemande cannot already have an ID", ENTITY_NAME, "idexists");
        }
        produitDemandeDTO = produitDemandeService.save(produitDemandeDTO);
        return ResponseEntity.created(new URI("/api/produit-demandes/" + produitDemandeDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, produitDemandeDTO.getId().toString()))
            .body(produitDemandeDTO);
    }

    /**
     * {@code PUT  /produit-demandes/:id} : Updates an existing produitDemande.
     *
     * @param id the id of the produitDemandeDTO to save.
     * @param produitDemandeDTO the produitDemandeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated produitDemandeDTO,
     * or with status {@code 400 (Bad Request)} if the produitDemandeDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the produitDemandeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProduitDemandeDTO> updateProduitDemande(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProduitDemandeDTO produitDemandeDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ProduitDemande : {}, {}", id, produitDemandeDTO);
        if (produitDemandeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, produitDemandeDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!produitDemandeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        produitDemandeDTO = produitDemandeService.update(produitDemandeDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, produitDemandeDTO.getId().toString()))
            .body(produitDemandeDTO);
    }

    /**
     * {@code PATCH  /produit-demandes/:id} : Partial updates given fields of an existing produitDemande, field will ignore if it is null
     *
     * @param id the id of the produitDemandeDTO to save.
     * @param produitDemandeDTO the produitDemandeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated produitDemandeDTO,
     * or with status {@code 400 (Bad Request)} if the produitDemandeDTO is not valid,
     * or with status {@code 404 (Not Found)} if the produitDemandeDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the produitDemandeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProduitDemandeDTO> partialUpdateProduitDemande(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProduitDemandeDTO produitDemandeDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ProduitDemande partially : {}, {}", id, produitDemandeDTO);
        if (produitDemandeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, produitDemandeDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!produitDemandeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProduitDemandeDTO> result = produitDemandeService.partialUpdate(produitDemandeDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, produitDemandeDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /produit-demandes} : get all the produitDemandes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of produitDemandes in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ProduitDemandeDTO>> getAllProduitDemandes(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of ProduitDemandes");
        Page<ProduitDemandeDTO> page = produitDemandeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /produit-demandes/:id} : get the "id" produitDemande.
     *
     * @param id the id of the produitDemandeDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the produitDemandeDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProduitDemandeDTO> getProduitDemande(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ProduitDemande : {}", id);
        Optional<ProduitDemandeDTO> produitDemandeDTO = produitDemandeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(produitDemandeDTO);
    }

    /**
     * {@code DELETE  /produit-demandes/:id} : delete the "id" produitDemande.
     *
     * @param id the id of the produitDemandeDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduitDemande(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ProduitDemande : {}", id);
        produitDemandeService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
