package com.ultex.crm.service;

import com.ultex.crm.domain.DemandeClient;
import com.ultex.crm.domain.ProduitDemande;
import com.ultex.crm.repository.DemandeClientRepository;
import com.ultex.crm.repository.ProduitDemandeRepository;
import com.ultex.crm.service.dto.DemandeClientDTO;
import com.ultex.crm.service.dto.ProduitDemandeDTO;
import com.ultex.crm.service.mapper.DemandeClientMapper;
import com.ultex.crm.service.mapper.ProduitDemandeMapper;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Extension service that ensures ProduitDemande are linked to DemandeClient before persistence.
 * Keeps generated DemandeClientService untouched while fixing the one-to-many persistence workflow.
 */
@Service
@Transactional
public class DemandeClientServiceExtension {

    private static final Logger LOG = LoggerFactory.getLogger(DemandeClientServiceExtension.class);

    private final DemandeClientRepository demandeClientRepository;
    private final ProduitDemandeRepository produitDemandeRepository;
    private final DemandeClientMapper demandeClientMapper;
    private final ProduitDemandeMapper produitDemandeMapper;

    public DemandeClientServiceExtension(
        DemandeClientRepository demandeClientRepository,
        ProduitDemandeRepository produitDemandeRepository,
        DemandeClientMapper demandeClientMapper,
        ProduitDemandeMapper produitDemandeMapper
    ) {
        this.demandeClientRepository = demandeClientRepository;
        this.produitDemandeRepository = produitDemandeRepository;
        this.demandeClientMapper = demandeClientMapper;
        this.produitDemandeMapper = produitDemandeMapper;
    }

    /**
     * Save with produit linkage hydrated before delegating to repository save.
     */
    public DemandeClientDTO save(DemandeClientDTO demandeClientDTO) {
        LOG.debug("Request to save DemandeClient (with produits) : {}", demandeClientDTO);
        DemandeClient demandeClient = mapDemandeWithProduits(demandeClientDTO);
        demandeClient = demandeClientRepository.save(demandeClient);
        return demandeClientMapper.toDto(demandeClient);
    }

    /**
     * Update with produit linkage hydrated before delegating to repository save.
     */
    public DemandeClientDTO update(DemandeClientDTO demandeClientDTO) {
        LOG.debug("Request to update DemandeClient (with produits) : {}", demandeClientDTO);
        DemandeClient demandeClient = mapDemandeWithProduits(demandeClientDTO);
        demandeClient = demandeClientRepository.save(demandeClient);
        return demandeClientMapper.toDto(demandeClient);
    }

    /**
     * Map DTO to entity while hydrating/attaching ProduitDemande children.
     */
    private DemandeClient mapDemandeWithProduits(DemandeClientDTO demandeClientDTO) {
        DemandeClient demandeClient;

        if (demandeClientDTO.getId() != null) {
            // Load existing entity (with produits) so removed produits can be detached
            demandeClient = demandeClientRepository.findOneWithEagerRelationships(demandeClientDTO.getId()).orElseGet(DemandeClient::new);
            demandeClientMapper.partialUpdate(demandeClient, demandeClientDTO);
        } else {
            demandeClient = demandeClientMapper.toEntity(demandeClientDTO);
        }

        Set<ProduitDemandeDTO> produitsDTO = demandeClientDTO.getProduits() != null
            ? demandeClientDTO.getProduits()
            : new LinkedHashSet<>();

        Set<ProduitDemande> produits = produitsDTO
            .stream()
            .filter(Objects::nonNull)
            .map(produitDTO -> hydrateProduit(produitDTO, demandeClient))
            .collect(Collectors.toCollection(LinkedHashSet::new));

        // Replace collection to sync bidirectional association via DemandeClient setter
        demandeClient.setProduits(produits);
        return demandeClient;
    }

    /**
     * Load existing ProduitDemande when id is present, otherwise map a new one, then set the back-reference.
     */
    private ProduitDemande hydrateProduit(ProduitDemandeDTO produitDemandeDTO, DemandeClient demandeClient) {
        ProduitDemande produit = produitDemandeDTO.getId() != null
            ? produitDemandeRepository.findById(produitDemandeDTO.getId()).orElseGet(ProduitDemande::new)
            : new ProduitDemande();

        if (produit.getId() != null) {
            // Existing produit: update its fields from DTO
            produitDemandeMapper.partialUpdate(produit, produitDemandeDTO);
        } else {
            // New produit: full mapping from DTO
            produit = produitDemandeMapper.toEntity(produitDemandeDTO);
        }

        produit.setDemande(demandeClient);
        return produit;
    }
}
