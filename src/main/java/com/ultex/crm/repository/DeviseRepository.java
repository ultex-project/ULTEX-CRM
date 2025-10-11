package com.ultex.crm.repository;

import com.ultex.crm.domain.Devise;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Devise entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DeviseRepository extends JpaRepository<Devise, Long> {}
