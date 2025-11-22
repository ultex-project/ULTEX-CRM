package com.ultex.crm.repository;

import com.ultex.crm.domain.RappelAgent;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the RappelAgent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RappelAgentRepository extends JpaRepository<RappelAgent, Long> {}
