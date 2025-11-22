package com.ultex.crm.repository;

import com.ultex.crm.domain.EtatInteraction;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the EtatInteraction entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EtatInteractionRepository extends JpaRepository<EtatInteraction, Long> {}
