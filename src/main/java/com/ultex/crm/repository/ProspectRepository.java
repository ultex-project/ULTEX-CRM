package com.ultex.crm.repository;

import com.ultex.crm.domain.Prospect;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Prospect entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProspectRepository extends JpaRepository<Prospect, Long> {}
