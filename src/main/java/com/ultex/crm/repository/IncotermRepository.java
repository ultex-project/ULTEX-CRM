package com.ultex.crm.repository;

import com.ultex.crm.domain.Incoterm;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Incoterm entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IncotermRepository extends JpaRepository<Incoterm, Long> {}
