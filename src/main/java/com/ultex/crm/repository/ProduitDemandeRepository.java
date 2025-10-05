package com.ultex.crm.repository;

import com.ultex.crm.domain.ProduitDemande;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProduitDemande entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProduitDemandeRepository extends JpaRepository<ProduitDemande, Long> {}
