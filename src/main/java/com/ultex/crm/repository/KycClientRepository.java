package com.ultex.crm.repository;

import com.ultex.crm.domain.KycClient;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the KycClient entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KycClientRepository extends JpaRepository<KycClient, Long> {}
