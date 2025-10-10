package com.ultex.crm.service;

import com.ultex.crm.domain.ProduitDemande;
import com.ultex.crm.repository.ProduitDemandeRepository;
import com.ultex.crm.service.dto.ProduitDemandeDTO;
import com.ultex.crm.service.mapper.ProduitDemandeMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.ProduitDemande}.
 */
@Service
@Transactional
public class ProduitDemandeService {

    private static final Logger LOG = LoggerFactory.getLogger(ProduitDemandeService.class);

    private final ProduitDemandeRepository produitDemandeRepository;

    private final ProduitDemandeMapper produitDemandeMapper;

    public ProduitDemandeService(ProduitDemandeRepository produitDemandeRepository, ProduitDemandeMapper produitDemandeMapper) {
        this.produitDemandeRepository = produitDemandeRepository;
        this.produitDemandeMapper = produitDemandeMapper;
    }

    /**
     * Save a produitDemande.
     *
     * @param produitDemandeDTO the entity to save.
     * @return the persisted entity.
     */
    public ProduitDemandeDTO save(ProduitDemandeDTO produitDemandeDTO) {
        LOG.debug("Request to save ProduitDemande : {}", produitDemandeDTO);
        ProduitDemande produitDemande = produitDemandeMapper.toEntity(produitDemandeDTO);
        produitDemande = produitDemandeRepository.save(produitDemande);
        return produitDemandeMapper.toDto(produitDemande);
    }

    /**
     * Update a produitDemande.
     *
     * @param produitDemandeDTO the entity to save.
     * @return the persisted entity.
     */
    public ProduitDemandeDTO update(ProduitDemandeDTO produitDemandeDTO) {
        LOG.debug("Request to update ProduitDemande : {}", produitDemandeDTO);
        ProduitDemande produitDemande = produitDemandeMapper.toEntity(produitDemandeDTO);
        produitDemande = produitDemandeRepository.save(produitDemande);
        return produitDemandeMapper.toDto(produitDemande);
    }

    /**
     * Partially update a produitDemande.
     *
     * @param produitDemandeDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProduitDemandeDTO> partialUpdate(ProduitDemandeDTO produitDemandeDTO) {
        LOG.debug("Request to partially update ProduitDemande : {}", produitDemandeDTO);

        return produitDemandeRepository
            .findById(produitDemandeDTO.getId())
            .map(existingProduitDemande -> {
                produitDemandeMapper.partialUpdate(existingProduitDemande, produitDemandeDTO);

                return existingProduitDemande;
            })
            .map(produitDemandeRepository::save)
            .map(produitDemandeMapper::toDto);
    }

    /**
     * Get all the produitDemandes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ProduitDemandeDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all ProduitDemandes");
        return produitDemandeRepository.findAll(pageable).map(produitDemandeMapper::toDto);
    }

    /**
     * Get one produitDemande by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProduitDemandeDTO> findOne(Long id) {
        LOG.debug("Request to get ProduitDemande : {}", id);
        return produitDemandeRepository.findById(id).map(produitDemandeMapper::toDto);
    }

    /**
     * Delete the produitDemande by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ProduitDemande : {}", id);
        produitDemandeRepository.deleteById(id);
    }
}
