package com.ultex.crm.repository;

import com.ultex.crm.domain.SousService;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SousService entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SousServiceRepository extends JpaRepository<SousService, Long> {}
