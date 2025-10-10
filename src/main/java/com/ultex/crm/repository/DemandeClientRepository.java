package com.ultex.crm.repository;

import com.ultex.crm.domain.DemandeClient;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DemandeClient entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DemandeClientRepository extends JpaRepository<DemandeClient, Long> {}
