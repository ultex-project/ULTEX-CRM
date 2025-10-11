package com.ultex.crm.repository;

import com.ultex.crm.domain.Pays;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Pays entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaysRepository extends JpaRepository<Pays, Long> {}
